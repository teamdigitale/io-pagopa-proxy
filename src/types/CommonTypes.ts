/**
 * Common Types
 */

import * as t from "io-ts";
import { WithinRangeNumber } from "italia-ts-commons/lib/numbers";
import { PatternString } from "italia-ts-commons/lib/strings";

export const Iban = PatternString("[a-zA-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}");
export type Iban = t.TypeOf<typeof Iban>;

export const FiscalCode = PatternString(
  "^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$"
);
export type FiscalCode = t.TypeOf<typeof FiscalCode>;

export const IUV = PatternString("[0-9]{15}|[0-9]{17}");
export type IUV = t.TypeOf<typeof IUV>;

export const Importo = WithinRangeNumber(0.11, 999999.99);
export type Importo = t.TypeOf<typeof Importo>;

export const CodiceIdRPT = t.intersection([
  t.interface({
    CF: FiscalCode,
    AuxDigit: t.keyof({ "0": 0, "1": 1, "2": 2, "3": 3 }),
    CodIUV: IUV
  }),
  t.partial({
    CodStazPA: PatternString("[0-9]{2}")
  })
]);

// Define an interface used to build responses for REST controllers
type IRestfulContentType =
  | string
  | number
  | boolean
  | ReadonlyArray<string>
  | ReadonlyArray<number>;

export interface IRestfulObject {
  readonly [key: string]:
    | IRestfulContentType
    | ReadonlyArray<IRestfulContentType>;
}