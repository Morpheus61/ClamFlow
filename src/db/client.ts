import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ClamFlowDB extends DBSchema {
  suppliers: {
    key: number;
    value: {
      id?: number;
      name: string;
      contact: string;
      licenseNumber: string;
      createdAt: string;
    };
    indexes: { 'by-name': string };
  };
  rawMaterials: {
    key: number;
    value: {
      id?: number;
      supplierId: number;
      weight: number;
      date: string;
      status: 'pending' | 'assigned';
      lotNumber: string | null;
      createdAt: string;
    };
    indexes: { 'by-date': string; 'by-status': string };
  };
  lots: {
    key: number;
    value: {
      id?: number;
      lotNumber: string;
      totalWeight: number;
      status: 'pending' | 'processing' | 'completed';
      createdAt: string;
    };
    indexes: { 'by-status': string };
  };
  processingBatches: {
    key: number;
    value: {
      id?: number;
      lotNumber: string;
      shellOnWeight: number;
      meatWeight: number;
      shellWeight: number;
      date: string;
      status: 'pending' | 'completed';
      createdAt: string;
    };
    indexes: { 'by-lot': string };
  };
  packages: {
    key: number;
    value: {
      id?: number;
      lotNumber: string;
      boxNumber: string;
      type: 'shell-on' | 'meat';
      weight: number;
      grade: string;
      date: string;
      createdAt: string;
    };
    indexes: { 'by-lot': string; 'by-box': string };
  };
}

let db: IDBPDatabase<ClamFlowDB>;

export async function getDB() {
  if (!db) {
    db = await openDB<ClamFlowDB>('clamflow-db', 1, {
      upgrade(db) {
        // Suppliers store
        if (!db.objectStoreNames.contains('suppliers')) {
          const supplierStore = db.createObjectStore('suppliers', {
            keyPath: 'id',
            autoIncrement: true
          });
          supplierStore.createIndex('by-name', 'name');
        }

        // Raw Materials store
        if (!db.objectStoreNames.contains('rawMaterials')) {
          const materialsStore = db.createObjectStore('rawMaterials', {
            keyPath: 'id',
            autoIncrement: true
          });
          materialsStore.createIndex('by-date', 'date');
          materialsStore.createIndex('by-status', 'status');
        }

        // Lots store
        if (!db.objectStoreNames.contains('lots')) {
          const lotsStore = db.createObjectStore('lots', {
            keyPath: 'id',
            autoIncrement: true
          });
          lotsStore.createIndex('by-status', 'status');
        }

        // Processing Batches store
        if (!db.objectStoreNames.contains('processingBatches')) {
          const batchesStore = db.createObjectStore('processingBatches', {
            keyPath: 'id',
            autoIncrement: true
          });
          batchesStore.createIndex('by-lot', 'lotNumber');
        }

        // Packages store
        if (!db.objectStoreNames.contains('packages')) {
          const packagesStore = db.createObjectStore('packages', {
            keyPath: 'id',
            autoIncrement: true
          });
          packagesStore.createIndex('by-lot', 'lotNumber');
          packagesStore.createIndex('by-box', 'boxNumber', { unique: true });
        }
      }
    });
  }
  return db;
}

export async function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}

export default {
  getDB,
  closeDB
};