import { describe, expect, it } from "vitest";
import { stableEntityId } from "../ids/stable-id";
import { type AppState, EMPTY_APP_STATE } from "../model/app-state";
import type { Recurrence } from "../model/recurrence";
import type { Transaction } from "../model/transaction";
import { planOccurrences } from "./plan";
import { occurrenceKey } from "./schedule";

const BASE = {
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "1754697600000-0000-01J9F3K2M7QX8YB4TVWZ0DCEHZ",
  deletedAt: null,
  dirty: 1,
} as const;

const SALARIO: Recurrence = {
  ...BASE,
  id: "SERIE-1",
  kind: "income",
  description: "Salário",
  amountMinor: 500_000,
  currency: "BRL",
  categoryId: null,
  paymentMethodId: null,
  cashbackMinor: null,
  frequency: "monthly",
  scheduleType: "dayOfMonth",
  scheduleN: 5,
  startOn: "2026-06-05",
  endOn: null,
  active: true,
};

function stateWith(series: Recurrence, transactions: Transaction[] = []): AppState {
  return {
    ...EMPTY_APP_STATE,
    recurrences: { [series.id]: series },
    transactions: Object.fromEntries(transactions.map((t) => [t.id, t])),
  };
}

describe("planOccurrences", () => {
  it("planeja uma ocorrência por competência vencida", () => {
    const plans = planOccurrences(stateWith(SALARIO), "2026-08-10");
    expect(plans.map((p) => p.draft.occurredOn)).toEqual([
      "2026-06-05",
      "2026-07-05",
      "2026-08-05",
    ]);
    expect(plans[0]?.draft).toMatchObject({ recurrenceId: "SERIE-1", amountMinor: 500_000 });
  });

  it("não planeja competência cuja linha já existe, mesmo apagada", () => {
    const period = "2026-06";
    const key = occurrenceKey("SERIE-1", period);
    const apagada: Transaction = {
      ...BASE,
      id: stableEntityId(key),
      deletedAt: BASE.updatedAt,
      kind: "income",
      description: "Salário",
      amountMinor: 500_000,
      currency: "BRL",
      categoryId: null,
      paymentMethodId: null,
      cashbackMinor: null,
      occurredOn: "2026-06-05",
      userId: null,
      recurrenceId: "SERIE-1",
      occurrenceKey: key,
    };
    const plans = planOccurrences(stateWith(SALARIO, [apagada]), "2026-07-10");
    expect(plans.map((p) => p.draft.occurredOn)).toEqual(["2026-07-05"]);
  });

  it("ignora série inativa, apagada ou que ainda não começou", () => {
    expect(planOccurrences(stateWith({ ...SALARIO, active: false }), "2026-08-10")).toEqual([]);
    expect(
      planOccurrences(stateWith({ ...SALARIO, deletedAt: BASE.updatedAt }), "2026-08-10"),
    ).toEqual([]);
    expect(planOccurrences(stateWith(SALARIO), "2026-06-01")).toEqual([]);
  });

  it("respeita endOn", () => {
    const plans = planOccurrences(stateWith({ ...SALARIO, endOn: "2026-07-01" }), "2026-09-10");
    expect(plans.map((p) => p.draft.occurredOn)).toEqual(["2026-06-05"]);
  });
});
