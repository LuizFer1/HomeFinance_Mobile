import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CrudDb } from "../../data/crud-db";
import { openTestDb, testSessionDeps } from "../../data/test-db.fake";
import { createCrudSession, LOCAL_USER_ID_KEY } from "../session/crud-session";
import { createOnboardingStore } from "./crud-store";

const LUIZ = { name: "Luiz", color: "teal", avatar: null } as const;

let db: CrudDb;

beforeEach(() => {
  db = openTestDb();
});

afterEach(async () => {
  vi.restoreAllMocks();
  await db.delete();
});

describe("createOnboardingStore (CRUD)", () => {
  it("precisa de onboarding só depois do boot e sem perfil local", async () => {
    const session = createCrudSession(testSessionDeps(db));
    const store = createOnboardingStore(session);
    expect(store.needsOnboarding.value).toBe(false);

    await session.init();
    expect(store.needsOnboarding.value).toBe(true);
  });

  it("complete grava tudo e sobrevive ao reabrir", async () => {
    const session = createCrudSession(testSessionDeps(db));
    await session.init();
    await createOnboardingStore(session).complete(LUIZ);

    const reaberta = createCrudSession(testSessionDeps(db));
    await reaberta.init();

    expect(createOnboardingStore(reaberta).needsOnboarding.value).toBe(false);
    expect(Object.keys(reaberta.state.value.categories)).toHaveLength(12);
    expect(Object.keys(reaberta.state.value.paymentMethods)).toHaveLength(4);
    expect(reaberta.state.value.users[reaberta.localUserId.value ?? ""]?.name).toBe("Luiz");
  });

  it("falha no meio não grava nada e continua pedindo onboarding", async () => {
    const session = createCrudSession(testSessionDeps(db));
    await session.init();
    const store = createOnboardingStore(session);
    vi.spyOn(db.categories, "bulkPut").mockRejectedValueOnce(new Error("quota exceeded"));

    await expect(store.complete(LUIZ)).rejects.toThrow("quota exceeded");

    expect(store.needsOnboarding.value).toBe(true);
    expect(await db.users.count()).toBe(0);
    expect(await db.meta.get(LOCAL_USER_ID_KEY)).toBeUndefined();
  });
});
