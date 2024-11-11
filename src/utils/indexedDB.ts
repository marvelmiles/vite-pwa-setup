// src/utils/indexedDB.ts
import { openDB } from "idb";
import { Product } from "../api/products";

const dbName = "productDB";
const storeName = "products";

export async function initDB() {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    },
  });
}

export async function addProduct(product: Product) {
  const db = await initDB();
  await db.put(storeName, product);
}

export async function getProducts() {
  const db = await initDB();
  return db.getAll(storeName);
}

export async function clearProducts() {
  const db = await initDB();
  return db.clear(storeName);
}
