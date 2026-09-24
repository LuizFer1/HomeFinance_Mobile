import "fake-indexeddb/auto";
import Dexie from "dexie";
import { describe, expect, it } from "vitest";
import { CrudDb } from "./crud-db";

describe("CrudDb", () => {
  it("upgrade da v1 descarta events e localUserId e mantém deviceId", async () => {
    const name = `homefinance-upgrade-${Date.now()}`;
    const v1 = new Dexie(name);
    v1.version(1).stores({ events: "id, hlc", meta: "key" });
    await v1.table("events").put({ id: "E1", hlc: "x" });
    await v1.table("meta").bulkPut([
      { key: "deviceId", value: "D1" },
      { key: "localUserId", value: "U1" },
    ]);
    v1.close();

    const db = new CrudDb(name);
    await db.open();

    expect(db.tables.map((t) => t.name)).not.toContain("events");
    expect(await db.meta.get("deviceId")).toEqual({ key: "deviceId", value: "D1" });
    expect(await db.meta.get("localUserId")).toBeUndefined();
    await db.delete();
  });

  it("banco novo abre com as cinco tabelas vazias", async () => {
    const db = new CrudDb(`homefinance-novo-${Date.now()}`);
    expect(await db.users.count()).toBe(0);
    expect(await db.transactions.count()).toBe(0);
    await db.delete();
  });
});
