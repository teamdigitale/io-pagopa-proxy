/**
 * App
 * Define a Restful Webservice and routes controller requests
 */

import * as bodyParser from "body-parser";
import * as express from "express";
import * as core from "express-serve-static-core";
import * as http from "http";
import { CONFIG } from "./Configuration";
import { NotificationController } from "./controllers/NotificationController";
import { TransactionController } from "./controllers/TransactionController";
import { UserController } from "./controllers/UserController";
import { WalletController } from "./controllers/WalletController";
import { NotificationSubscriptionRequestType } from "./enums/NotificationSubscriptionType";
import { logger } from "./utils/Logger";

// Define server and routes
export class App {
  private readonly app?: core.Express;
  private server?: http.Server; // tslint:disable-line
  private readonly serverPort?: number | string | boolean;

  public constructor() {
    this.serverPort = this.normalizePort(
      process.env.PORT || CONFIG.CONTROLLER.PORT
    );
    this.app = express();
    this.setGlobalSettings();
    this.setServerRoutes();
  }

  public startServer(): boolean {
    logger.info("Starting Proxy PagoPa Server...");
    if (this.app === undefined) {
      return false;
    }
    this.server = http.createServer(this.app);
    this.server.listen(this.serverPort);
    this.server.on("error", this.onError);
    this.server.on("listening", this.onListening);
    return true;
  }

  public stopServer(): boolean {
    logger.info("Stopping Proxy PagoPa Server...");
    if (this.server === undefined) {
      return false;
    }
    this.server.close();
    return true;
  }

  private setServerRoutes(): boolean {
    if (this.app === undefined) {
      return false;
    }
    this.app.get(CONFIG.CONTROLLER.ROUTES.LOGIN, (req, res) => {
      logger.info("Serving Login Request (GET)...");
      UserController.login(req, res);
    });
    this.app.get(CONFIG.CONTROLLER.ROUTES.LOGIN_ANONYMOUS, (req, res) => {
      logger.info("Serving LoginAnonymous Request (GET)...");
      UserController.loginAnonymous(req, res);
    });
    this.app.get(CONFIG.CONTROLLER.ROUTES.WALLET, (req, res) => {
      logger.info("Serving Wallet Request (GET)...");
      WalletController.getWallet(req, res);
    });
    this.app.get(CONFIG.CONTROLLER.ROUTES.TRANSACTIONS, (req, res) => {
      logger.info("Serving Transactions Request (GET)...");
      TransactionController.getTransactions(req, res);
    });
    this.app.get(CONFIG.CONTROLLER.ROUTES.TRANSACTION, (req, res) => {
      logger.info("Serving Transaction Request (GET)...");
      TransactionController.getTransactions(req, res);
    });
    this.app.post(
      CONFIG.CONTROLLER.ROUTES.NOTIFICATION_ACTIVATION,
      (req, res) => {
        logger.info("Serving Notification Activation Request (POST)...");
        NotificationController.updateSubscription(
          req,
          res,
          NotificationSubscriptionRequestType.ACTIVATION
        );
      }
    );
    this.app.post(
      CONFIG.CONTROLLER.ROUTES.NOTIFICATION_DEACTIVATION,
      (req, res) => {
        logger.info("Serving Notification Deactivation REQUEST (POST)...");
        NotificationController.updateSubscription(
          req,
          res,
          NotificationSubscriptionRequestType.DEACTIVATION
        );
      }
    );
    return true;
  }

  private setGlobalSettings(): boolean {
    if (this.app === undefined) {
      return false;
    }
    this.app.set("port", this.serverPort);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    return true;
  }

  private normalizePort(val: number | string): number | string | boolean {
    const xport: number = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(xport)) {
      return val;
    } else if (xport >= 0) {
      return xport;
    } else {
      return false;
    }
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error;
    }
    const stringPort = String(this.serverPort);
    const bind =
      typeof this.serverPort === "string"
        ? "Pipe " + stringPort
        : "Port " + stringPort;
    switch (error.code) {
      case "EACCES":
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private onListening(): boolean {
    if (this.server === undefined) {
      return false;
    }
    const addr = this.server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    logger.debug(`Listening on ${bind}`);
    return true;
  }
}