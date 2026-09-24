import type { Ulid } from "../ids/ulid";
import type { Category } from "./category";
import type { PaymentMethod } from "./payment-method";
import type { Recurrence } from "./recurrence";
import type { Transaction } from "./transaction";
import type { User } from "./user";

/** Nome da tabela → tipo da linha. Fonte única de verdade para o resto. */
export interface RowMap {
  users: User;
  categories: Category;
  paymentMethods: PaymentMethod;
  transactions: Transaction;
  recurrences: Recurrence;
}

export type TableName = keyof RowMap;
export type RowOf<K extends TableName> = RowMap[K];

/** Espelho em memória das tabelas, inclusive linhas apagadas. */
export type AppState = { [K in TableName]: Record<Ulid, RowMap[K]> };

export type RowsByTable = { [K in TableName]?: RowMap[K][] };

export const TABLE_NAMES: readonly TableName[] = [
  "users",
  "categories",
  "paymentMethods",
  "transactions",
  "recurrences",
];

export const EMPTY_APP_STATE: AppState = {
  users: {},
  categories: {},
  paymentMethods: {},
  transactions: {},
  recurrences: {},
};
