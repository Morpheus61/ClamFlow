import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';

export function useCollection<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      ...queryConstraints
    );

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      error: (err) => {
        console.error('Firestore error:', err);
        setError(err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]);

  const add = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
}