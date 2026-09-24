import { computed, type ReadonlySignal } from "@preact/signals";
import type { UserDraft } from "../../domain/model/user";
import type { CrudSession } from "../session/crud-session";
import { buildOnboardingRows } from "./crud-seed";

export interface OnboardingStore {
  needsOnboarding: ReadonlySignal<boolean>;
  complete: (draft: UserDraft) => Promise<void>;
}

/**
 * Primeiro uso é `localUserId` vazio, não "não existe user na tabela": depois
 * do sync o perfil da outra pessoa estará lá. O `ready` evita o wizard piscar
 * antes de o disco responder.
 */
export function createOnboardingStore(session: CrudSession): OnboardingStore {
  return {
    needsOnboarding: computed(
      () => session.status.value === "ready" && session.localUserId.value === null,
    ),
    async complete(draft) {
      const { rows, meta } = buildOnboardingRows(draft, session.clock());
      // Uma transação só: falha não deixa app meio semeado, e `localUserId`
      // continua nulo, então o usuário volta ao wizard.
      await session.putRows(rows, meta);
    },
  };
}
