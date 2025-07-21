// src/services/imageService.js
// Service for handling image storage with IndexedDB

import { IMAGE_DB_NAME, IMAGE_STORE_NAME } from '../constants';

function openImageDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(IMAGE_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'key', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImageToIndexedDB(imageDataUrl) {
  const db = await openImageDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([IMAGE_STORE_NAME], 'readwrite');
    const store = tx.objectStore(IMAGE_STORE_NAME);
    const entry = { data: imageDataUrl };
    const req = store.add(entry);
    req.onsuccess = (e) => resolve(req.result); // key
    req.onerror = (e) => reject(req.error);
  });
}

export async function getImageFromIndexedDB(key) {
  const db = await openImageDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([IMAGE_STORE_NAME], 'readonly');
    const store = tx.objectStore(IMAGE_STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ? req.result.data : null);
    req.onerror = () => reject(req.error);
  });
}
