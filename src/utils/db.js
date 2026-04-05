// --- INDEXED DB WRAPPER FOR PWA OFFLINE STORAGE ---
const DB_NAME = 'AgriEdgeDB';
const DB_VERSION = 2; // Incremented for indexes

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not available'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      
      // Robust object store creation without strict version locking
      if (!db.objectStoreNames.contains('user')) {
        db.createObjectStore('user', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id' });
        historyStore.createIndex('date', 'date', { unique: false });
        historyStore.createIndex('crop', 'crop.id', { unique: false });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const dbSaveUser = async (user) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user', 'readwrite');
    tx.objectStore('user').put(user);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
};

export const dbGetUser = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user', 'readonly');
    const request = tx.objectStore('user').getAll();
    
    request.onsuccess = () => {
      const users = request.result;
      if (users && users.length > 0) {
        // Prioritize the new 'profile' ID, fallback to legacy timestamp ID if upgrading
        const profile = users.find(u => u.id === 'profile') || users[0];
        resolve(profile);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = (e) => reject(e.target.error);
  });
};

export const dbClearUser = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user', 'readwrite');
    tx.objectStore('user').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
};

export const dbSaveHistory = async (record) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
};

export const dbGetHistory = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readonly');
    const request = tx.objectStore('history').getAll();
    request.onsuccess = () => {
      const sorted = request.result.sort((a, b) => b.timestamp - a.timestamp);
      resolve(sorted);
    };
    request.onerror = (e) => reject(e.target.error);
  });
};

export const dbClearHistory = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
};
