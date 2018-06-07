/**
 * Payments Converter
 * Data Converter for Payments Request\Responses between PagoPa and BackendAPP types
 */
import { Either, left, right } from "fp-ts/lib/Either";
import {
  codificaInfrastrutturaPSPEnum,
  IcdInfoWispInput,
  InodoAttivaRPTInput,
  InodoAttivaRPTOutput,
  InodoVerificaRPTInput,
  InodoVerificaRPTOutput,
  PPTPortTypes
} from "italia-pagopa-api/dist/wsdl-lib/PagamentiTelematiciPspNodoservice/PPTPort";
import * as uuid from "uuid";
import { PagoPaConfig } from "../Configuration";
import { ControllerError } from "../enums/ControllerError";
import { PaymentsActivationRequest } from "../types/controllers/PaymentsActivationRequest";
import { PaymentsActivationResponse } from "../types/controllers/PaymentsActivationResponse";
import { PaymentsCheckRequest } from "../types/controllers/PaymentsCheckRequest";
import { PaymentsCheckResponse } from "../types/controllers/PaymentsCheckResponse";
import { PaymentsStatusUpdateRequest } from "../types/controllers/PaymentsStatusUpdateRequest";
import { CodiceContestoPagamento } from "../types/PagoPaTypes";

// Convert PaymentsCheckRequest (controller) to PaymentsCheckRequestPagoPa (PagoPa API)
export function getPaymentsCheckRequestPagoPa(
  pagoPaConfig: PagoPaConfig,
  paymentsCheckRequest: PaymentsCheckRequest,
  codiceContestoPagamento: CodiceContestoPagamento
): Either<Error, InodoVerificaRPTInput> {
  return right({
    identificativoPSP: pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_PSP,
    identificativoIntermediarioPSP:
      pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_INTERMEDIARIO_PSP,
    identificativoCanale: pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_CANALE,
    password: pagoPaConfig.IDENTIFIER.TOKEN,
    codiceContestoPagamento,
    codificaInfrastrutturaPSP: codificaInfrastrutturaPSPEnum.QR_CODE,
    codiceIdRPT: {
      CF: paymentsCheckRequest.codiceIdRPT.CF,
      AuxDigit: paymentsCheckRequest.codiceIdRPT.AuxDigit,
      CodStazPA: paymentsCheckRequest.codiceIdRPT.CodStazPA,
      CodIUV: paymentsCheckRequest.codiceIdRPT.CodIUV
    }
  });
}

// Convert PaymentsCheckResponsePagoPa (PagoPa API) to PaymentsCheckResponse (controller)
export function getPaymentsCheckResponse(
  iNodoVerificaRPTOutput: InodoVerificaRPTOutput,
  codiceContestoPagamento: CodiceContestoPagamento
): Either<Error, PaymentsCheckResponse> {
  if (
    iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.esito ===
    PPTPortTypes.Esito.KO
  ) {
    return left(new Error(ControllerError.REQUEST_REJECTED));
  }
  const errorOrPaymentCheckResponse = PaymentsCheckResponse.decode({
    importoSingoloVersamento:
      iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
        .importoSingoloVersamento,
    codiceContestoPagamento,
    ibanAccredito:
      iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
        .ibanAccredito,
    causaleVersamento:
      iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
        .causaleVersamento,
    enteBeneficiario: {
      codiceIdentificativoUnivoco:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.identificativoUnivocoBeneficiario,
      denominazioneBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.denominazioneBeneficiario,
      codiceUnitOperBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.codiceUnitOperBeneficiario,
      denomUnitOperBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.denomUnitOperBeneficiario,
      indirizzoBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.indirizzoBeneficiario,
      civicoBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.civicoBeneficiario,
      capBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.capBeneficiario,
      localitaBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.localitaBeneficiario,
      provinciaBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.provinciaBeneficiario,
      nazioneBeneficiario:
        iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.nazioneBeneficiario
    },
    spezzoniCausaleVersamento:
      iNodoVerificaRPTOutput.nodoVerificaRPTRisposta.datiPagamentoPA
        .spezzoniCausaleVersamento
  });

  if (errorOrPaymentCheckResponse.isLeft()) {
    return left(new Error(ControllerError.ERROR_INVALID_INPUT));
  }
  return right(errorOrPaymentCheckResponse.value);
}

// Convert PaymentsActivationRequest (controller) to PaymentsActivationRequestPagoPa (PagoPa API)
export function getPaymentsActivationRequestPagoPa(
  pagoPaConfig: PagoPaConfig,
  paymentsActivationRequest: PaymentsActivationRequest
): Either<Error, InodoAttivaRPTInput> {
  return right({
    identificativoPSP: pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_PSP,
    identificativoIntermediarioPSP:
      pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_INTERMEDIARIO_PSP,
    identificativoCanale: pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_CANALE,
    password: pagoPaConfig.IDENTIFIER.TOKEN,
    codiceContestoPagamento: paymentsActivationRequest.codiceContestoPagamento,
    identificativoIntermediarioPSPPagamento:
      pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_INTERMEDIARIO_PSP,
    identificativoCanalePagamento:
      pagoPaConfig.IDENTIFIER.IDENTIFICATIVO_CANALE,
    codificaInfrastrutturaPSP: codificaInfrastrutturaPSPEnum.QR_CODE,
    codiceIdRPT: {
      CF: paymentsActivationRequest.codiceIdRPT.CF,
      AuxDigit: paymentsActivationRequest.codiceIdRPT.AuxDigit,
      CodStazPA: paymentsActivationRequest.codiceIdRPT.CodStazPA,
      CodIUV: paymentsActivationRequest.codiceIdRPT.CodIUV
    },
    datiPagamentoPSP: {
      importoSingoloVersamento:
        paymentsActivationRequest.importoSingoloVersamento
    }
  });
}

// Convert PaymentsActivationResponsePagoPa (PagoPa API) to PaymentsActivationkResponse (controller)
export function getPaymentsActivationResponse(
  iNodoAttivaRPTOutput: InodoAttivaRPTOutput
): Either<Error, PaymentsActivationResponse> {
  if (
    iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.esito === PPTPortTypes.Esito.KO
  ) {
    return left(new Error(ControllerError.REQUEST_REJECTED));
  }
  const errorOrPaymentsActivationResponse = PaymentsActivationResponse.decode({
    importoSingoloVersamento:
      iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
        .importoSingoloVersamento,
    ibanAccredito:
      iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA.ibanAccredito,
    causaleVersamento:
      iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
        .causaleVersamento,
    enteBeneficiario: {
      identificativoUnivocoBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.identificativoUnivocoBeneficiario,
      denominazioneBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.denominazioneBeneficiario,
      codiceUnitOperBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.codiceUnitOperBeneficiario,
      denomUnitOperBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.denomUnitOperBeneficiario,
      indirizzoBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.indirizzoBeneficiario,
      civicoBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.civicoBeneficiario,
      capBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.capBeneficiario,
      localitaBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.localitaBeneficiario,
      provinciaBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.provinciaBeneficiario,
      nazioneBeneficiario:
        iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
          .enteBeneficiario.nazioneBeneficiario
    },
    spezzoniCausaleVersamento:
      iNodoAttivaRPTOutput.nodoAttivaRPTRisposta.datiPagamentoPA
        .spezzoniCausaleVersamento
  });

  if (errorOrPaymentsActivationResponse.isLeft()) {
    return left(new Error(ControllerError.ERROR_INVALID_INPUT));
  }
  return right(errorOrPaymentsActivationResponse.value);
}

// Convert PaymentsStatusUpdateRequestPagoPa (PagoPa API) to PaymentsStatusUpdateRequest (controller)
export function getPaymentsStatusUpdateRequest(
  paymentsStatusUpdateRequestPagoPa: IcdInfoWispInput
): Either<Error, PaymentsStatusUpdateRequest> {
  const errorOrPaymentsStatusUpdateRequest = PaymentsStatusUpdateRequest.decode(
    {
      codiceContestoPagamento:
        paymentsStatusUpdateRequestPagoPa.codiceContestoPagamento,
      idPagamento: paymentsStatusUpdateRequestPagoPa.idPagamento
    }
  );

  if (errorOrPaymentsStatusUpdateRequest.isLeft()) {
    return left(new Error(ControllerError.ERROR_INVALID_INPUT));
  }

  return right(errorOrPaymentsStatusUpdateRequest.value);
}

// Generate a Session Token to follow a stream of requests
export function generateCodiceContestoPagamento(): Either<
  Error,
  CodiceContestoPagamento
> {
  const errorOrCodiceContestoPagamento = CodiceContestoPagamento.decode(
    uuid.v1()
  );

  if (errorOrCodiceContestoPagamento.isLeft()) {
    return left(new Error(ControllerError.ERROR_INTERNAL));
  }
  return right(errorOrCodiceContestoPagamento.value);
}
