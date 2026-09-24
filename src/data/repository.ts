import type { Table } from "dexie";
import type { RowClock } from "../domain/clock/row-clock";
import type { Ulid } from "../domain/ids/ulid";
import type { BaseRow, Draft } from "../domain/model/base";

/**
 * Porta de escrita única de todas as tabelas. Toda falha rejeita — quem chama
 * precisa saber que não salvou.
 */
export interface Repository<T extends BaseRow> {
  listAll: () => Promise<T[]>;
  /** `id` explícito só para identidade determinística (materialização). */
  create: (draft: Draft<T>, id?: Ulid) => Promise<T>;
  /** LWW por linha: grava a linha inteira. Sem mudança real, não escreve. */
  update: (id: Ulid, changes: Partial<Draft<T>>) => Promise<T>;
  /** Exclusão lógica: a linha fica, com `deletedAt`, para o hub propagar. */
  remove: (id: Ulid) => Promise<T>;
}

/**
 * Monta uma linha nova sem gravar — para lotes que precisam de uma transação
 * só (primeiro uso, materialização).
 *
 * O duplo cast é o preço do genérico: `Draft<T> & BaseRow` é `T` por
 * construção, mas o TypeScript não prova isso para um `T` aberto.
 */
export function buildRow<T extends BaseRow>(clock: RowClock, draft: Draft<T>, id?: Ulid): T {
  const { hlc, iso } = clock.stamp();
  const base: BaseRow = {
    id: id ?? clock.newId(),
    createdAt: iso,
    updatedAt: hlc,
    deletedAt: null,
    dirty: 1,
  };
  return { ...draft, ...base } as unknown as T;
}

function hasChanges(current: object, changes: object): boolean {
  const record = current as Record<string, unknown>;
  return Object.entries(changes).some(([field, value]) => record[field] !== value);
}

export function createRepository<T extends BaseRow>(
  table: Table<T, string>,
  clock: RowClock,
): Repository<T> {
  async function load(id: Ulid): Promise<T> {
    const current = await table.get(id);
    if (current === undefined) throw new Error(`Registro ${id} não existe`);
    return current;
  }

  return {
    listAll: () => table.toArray(),

    async create(draft, id) {
      const row = buildRow<T>(clock, draft, id);
      await table.put(row);
      return row;
    },

    async update(id, changes) {
      const current = await load(id);
      if (current.deletedAt !== null) throw new Error(`Registro ${id} foi removido`);
      if (!hasChanges(current, changes)) return current;

      const next: T = { ...current, ...changes, updatedAt: clock.stamp().hlc, dirty: 1 };
      await table.put(next);
      return next;
    },

    async remove(id) {
      const current = await load(id);
      if (current.deletedAt !== null) return current;

      const { hlc } = clock.stamp();
      const next: T = { ...current, deletedAt: hlc, updatedAt: hlc, dirty: 1 };
      await table.put(next);
      return next;
    },
  };
}
