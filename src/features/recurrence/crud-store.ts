import { buildRow } from "../../data/repository";
import type { Ulid } from "../../domain/ids/ulid";
import type { Recurrence, RecurrenceDraft, RecurrenceRule } from "../../domain/model/recurrence";
import type { Transaction, TransactionDraft } from "../../domain/model/transaction";
import { planOccurrences } from "../../domain/recurrence/plan";
import type { CrudSession } from "../session/crud-session";

/**
 * Série de recorrência: cria a partir de um lançamento + regra, materializa o
 * que venceu e edita/remove a série (a série é uma linha como qualquer
 * outra; as ocorrências, `Transaction`s ligadas por `recurrenceId`).
 */
export interface RecurrenceStore {
  /** Cria a série a partir do lançamento + regra e materializa o que venceu. */
  createSeries: (draft: TransactionDraft, rule: RecurrenceRule, today: string) => Promise<void>;
  /** Gera as ocorrências que faltam (no boot e ao criar série). */
  materializeDue: (today: string) => Promise<void>;
  editSeries: (id: Ulid, draft: RecurrenceDraft) => Promise<Recurrence>;
  removeSeries: (id: Ulid) => Promise<Recurrence>;
}

export function createRecurrenceStore(session: CrudSession): RecurrenceStore {
  async function materializeDue(today: string): Promise<void> {
    const plans = planOccurrences(session.state.value, today);
    if (plans.length === 0) return;

    const clock = session.clock();
    const userId = session.localUserId.value;
    // Monta as linhas fora da transação (`buildRow` não grava) e grava todas
    // de uma vez com `putRows`: um lote só em vez de N escritas soltas, e o
    // id determinístico de cada ocorrência já vem do plano.
    const rows = plans.map((plan) =>
      buildRow<Transaction>(clock, { ...plan.draft, userId }, plan.entityId),
    );
    await session.putRows({ transactions: rows });
  }

  return {
    async createSeries(draft, rule, today) {
      const series: RecurrenceDraft = {
        kind: draft.kind,
        description: draft.description,
        amountMinor: draft.amountMinor,
        currency: "BRL",
        categoryId: draft.categoryId,
        paymentMethodId: draft.paymentMethodId,
        cashbackMinor: draft.cashbackMinor,
        frequency: rule.frequency,
        scheduleType: rule.scheduleType,
        scheduleN: rule.scheduleN,
        startOn: draft.occurredOn,
        endOn: rule.endOn,
        active: true,
      };
      // Se a série não gravar, `mutate` rejeita e a materialização nem começa.
      await session.mutate("recurrences", (repo) => repo.create(series));
      await materializeDue(today);
    },

    materializeDue,

    editSeries: (id, draft) => session.mutate("recurrences", (repo) => repo.update(id, draft)),
    removeSeries: (id) => session.mutate("recurrences", (repo) => repo.remove(id)),
  };
}
