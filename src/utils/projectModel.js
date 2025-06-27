// src/utils/projectModel.js
// Model for saving, reading, and writing projects (localStorage for now, backend-ready)

const PROJECT_PREFIX = 'flowtile_project_';

export const saveProject = (name, data) => {
  localStorage.setItem(`${PROJECT_PREFIX}${name}`, JSON.stringify(data));
};

export const loadProject = (name) => {
  const data = localStorage.getItem(`${PROJECT_PREFIX}${name}`);
  return data ? JSON.parse(data) : null;
};

export const listProjects = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(PROJECT_PREFIX))
    .map(key => key.replace(PROJECT_PREFIX, ''));
};

export const deleteProject = (name) => {
  localStorage.removeItem(`${PROJECT_PREFIX}${name}`);
};

// IndexedDB helpers for image storage
const IMAGE_DB_NAME = 'flowtile_images_db';
const IMAGE_STORE_NAME = 'flowtile_images';

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
