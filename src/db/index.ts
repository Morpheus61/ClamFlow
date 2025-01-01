import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Supplier, RawMaterial, Lot, ProcessingBatch, Package } from '../types';

// Collection names constants
export const COLLECTIONS = {
  SUPPLIERS: 'suppliers',
  RAW_MATERIALS: 'rawMaterials',
  LOTS: 'lots',
  PROCESSING_BATCHES: 'processingBatches',
  PACKAGES: 'packages',
  PRODUCT_GRADES: 'productGrades'
} as const;

// Generic CRUD operations
export async function getAll<T>(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
}

export async function add<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function update<T>(collectionName: string, id: string, data: Partial<T>) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function remove(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

// Collection-specific queries
export async function getSuppliers() {
  return getAll<Supplier>(COLLECTIONS.SUPPLIERS);
}

export async function getRawMaterials(status?: 'pending' | 'assigned') {
  const materialsRef = collection(db, COLLECTIONS.RAW_MATERIALS);
  const constraints = [];
  
  if (status) {
    constraints.push(where('status', '==', status));
  }
  
  constraints.push(orderBy('date', 'desc'));
  
  const q = query(materialsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as RawMaterial[];
}

export async function getLots(status?: string) {
  const lotsRef = collection(db, COLLECTIONS.LOTS);
  const constraints = [];
  
  if (status) {
    constraints.push(where('status', '==', status));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  const q = query(lotsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lot[];
}

export async function getProcessingBatches(lotNumber?: string) {
  const batchesRef = collection(db, COLLECTIONS.PROCESSING_BATCHES);
  const constraints = [];
  
  if (lotNumber) {
    constraints.push(where('lotNumber', '==', lotNumber));
  }
  
  constraints.push(orderBy('date', 'desc'));
  
  const q = query(batchesRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ProcessingBatch[];
}

export async function getPackages(lotNumber?: string) {
  const packagesRef = collection(db, COLLECTIONS.PACKAGES);
  const constraints = [];
  
  if (lotNumber) {
    constraints.push(where('lotNumber', '==', lotNumber));
  }
  
  constraints.push(orderBy('date', 'desc'));
  
  const q = query(packagesRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Package[];
}

export { db };