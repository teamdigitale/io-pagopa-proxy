[![CircleCI](https://circleci.com/gh/teamdigitale/italia-pagopa-proxy.svg?style=svg)](https://circleci.com/gh/teamdigitale/italia-pagopa-proxy)

[![codecov](https://codecov.io/gh/teamdigitale/italia-pagopa-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/teamdigitale/italia-pagopa-proxy)

[![Maintainability](https://api.codeclimate.com/v1/badges/5a8e35c5db40f63c3ebf/maintainability)](https://codeclimate.com/github/teamdigitale/italia-pagopa-proxy/maintainability)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fteamdigitale%2Fitalia-pagopa-proxy.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fteamdigitale%2Fitalia-pagopa-proxy?ref=badge_shield)

# PagoPA Proxy

## What is this?

This is a proxy for handling interactions with the pagoPA backend.

This project is part of the [digital citizenship initiative](https://teamdigitale.governo.it/en/projects/digital-citizenship.htm).

## ADRs

We use [ADR](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)s to track architectural decisions of this project.

This repository is configured for Nat Pryce's [adr-tools](https://github.com/npryce/adr-tools).

Here's the decisions we taken so far:

| ADR | Title                                                                                             | PR (discussion)                                                      |
| --- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | [Record architecture decisions](doc/architecture/decisions/0001-record-architecture-decisions.md) | [PR#25](https://github.com/teamdigitale/italia-pagopa-proxy/pull/25) |
| 2   | [Use uuid/v1 for sequential requests](doc/adr/0002-use-uuid-v1-for-sequential-requests.md)        | [PR#37](https://github.com/teamdigitale/italia-pagopa-proxy/pull/37) |

## NOTES

This project includes @types/bluebird because it's necessary for node-soap.
It will be removed when this dependency will be fixed into soap:
https://github.com/vpulim/node-soap/pull/1009

### Environment variables

Those are all Environment variables needed by the application:

| Variable name                              | Description                                                     | type    | default                                            |
| ------------------------------------------ | --------------------------------------------------------------- | ------- | -------------------------------------------------- |
| WINSTON_LOG_LEVEL                          | The log level used for Winston logger                           | logLev  | debug                                              |
| PAGOPAPROXY_HOST                           | The hostname or IP address the Express server is listening to   | string  | localhost                                          |
| PAGOPAPROXY_PORT                           | The HTTP port the Express server is listening to                | int     | 3000                                               |
| PAGOPAPROXY_CLIENT_CERTIFICATE_FINGERPRINT | SHA256 client certificate fingerprint (without `:` separators)  | string  |                                                    |
| PAGOPA_HOST                                | The PagoPA SOAP Server hostname or IP address                   | string  | localhost                                          |
| PAGOPA_PORT                                | The PagoPA SOAP Server port                                     | int     | 3001                                               |
| PAGOPA_CERT                                | The PagoPA SOAP Server client certificate in base64             | string  |                                                    |
| PAGOPA_KEY                                 | The PagoPA SOAP Server client certificate private key in base64 | string  |                                                    |
| PAGOPA_WS_URI                              | The PagoPA SAAP Server URI for SOAP WebService                  | string  | /webservices/pof/PagamentiTelematiciPspNodoservice |
| PAGOPA_HOST_HEADER                         | The PagoPA SOAP Server Host option for HTTP header              | string  |                                                    |
| PAGOPA_PASSWORD                            | The password used to authenticate to PagoPA SOAP Server         | string  |                                                    |
| PAGOPA_TIMEOUT_MSEC                        | The PagoPA SOAP Client Timeout in milliseconds                  | int     | 60000                                              |
| PAGOPA_ID_PSP                              | The IDENTIFICATIVO_PSP value provided to PagoPA                 | string  |                                                    |
| PAGOPA_ID_INT_PSP                          | The IDENTIFICATIVO_INTERMEDIARIO_PSP value provided to PagoPA   | string  |                                                    |
| PAGOPA_ID_CANALE                           | The IDENTIFICATIVO_CANALE value provided to PagoPA              | string  |                                                    |
| PAGOPA_ID_CANALE_PAGAMENTO                 | The IDENTIFICATIVO_CANALE_PAGAMENTO value provided to PagoPA    | string  |                                                    |
| REDIS_DB_URL                               | The Redis DB Server URL                                         | string  | localhost                                          |
| REDIS_DB_PORT                              | The Redis DB Server port                                        | int     | 6379                                               |
| REDIS_DB_PASSWORD                          | The Redis DB Server password                                    | string  |                                                    |
| REDIS_USE_CLUSTER                          | Enable Redis Cluster                                            | boolean | false                                              |
| APPINSIGHTS_INSTRUMENTATIONKEY | Instrumentation key for application insights | string | |

logLev values: "error", "info", "debug"

## OpenAPI specs

Swagger API specs are available at /specs/api/v1/swagger.json
For example, running it on local enviroment it's reachable at http://localhost:3000/api/v1/swagger.json

## How to install and run the application

1. yarn install
2. yarn build
3. yarn start

The parameter `PAGOPA_PASSWORD` is required. To start the server in development mode, you must set it via ENV vars:

```
PAGOPA_PASSWORD=nopassword yarn start
```

Also be sure to use a valid configuration for REDIS server or install it on local machine.

## Production deployments and Kubernetes settings

In production deployments, the application communicates with PagoPA performing a TLS mutual authentication and establishing a TLS encrypted tunnel.

Authentication and tunnel mechanisms are transparent for the pagopa-proxy application and are offloaded to third-party components.

Normally, the pagopa-proxy application is deployed as a set of Kubernetes resources. A specific *helm-chart* has been developed and currently used to deploy the application. The chart includes some configuration files that deploy a sidecar container that manages the authentication and encryption mechanisms with PagoPA.

More information about how the pagopa-proxy application communicates with PagoPA, and how to deploy the helm-chart can be found in the [pagopa-proxy helm-chart folder in the io-infrastructure-post-config repository](https://github.com/teamdigitale/io-infrastructure-post-config/tree/master/pagopa-proxy).

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fteamdigitale%2Fitalia-pagopa-proxy.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fteamdigitale%2Fitalia-pagopa-proxy?ref=badge_large)
