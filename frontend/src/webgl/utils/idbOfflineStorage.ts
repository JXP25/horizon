export async function storeOfflineData(bboxKey: string, data: any) {
    const db = await openDB();
    const tx = db.transaction("offlineAreas", "readwrite");
    tx.objectStore("offlineAreas").put({ bboxKey, data });
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  
  async function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open("OfflineMapDB", 1);
      req.onupgradeneeded = (evt) => {
        const db = req.result;
        if (!db.objectStoreNames.contains("offlineAreas")) {
          db.createObjectStore("offlineAreas", { keyPath: "bboxKey" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  
  export async function getAllOfflineAreas(): Promise<
  Array<{ bboxKey: string; data: any }>
> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("offlineAreas", "readonly");
    const store = tx.objectStore("offlineAreas");
    const req = store.getAll(); 

    req.onsuccess = () => {
      resolve(req.result as Array<{ bboxKey: string; data: any }>);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineArea(bboxKey: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("offlineAreas", "readwrite");
    const store = tx.objectStore("offlineAreas");
    const req = store.delete(bboxKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineArea(bboxKey: string): Promise<any> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("offlineAreas", "readonly");
    const store = tx.objectStore("offlineAreas");
    const req = store.get(bboxKey);
    req.onsuccess = () => resolve(req.result?.data);
    req.onerror = () => reject(req.error);
  });
}