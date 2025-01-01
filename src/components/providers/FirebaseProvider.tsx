import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { Firestore } from '@firebase/firestore';
import { Storage } from '@firebase/storage';
import { Analytics } from '@firebase/analytics';
import { Auth } from '@firebase/auth';
import { app, auth, db, storage, analytics } from '../../lib/firebase';

interface FirebaseContextType {
  app: any;
  auth: Auth;
  db: Firestore;
  storage: Storage;
  analytics: Analytics | null;
  initialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Verify Firebase is initialized
      if (!app || !auth || !db || !storage) {
        throw new Error('Firebase services not properly initialized');
      }

      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged(() => {
        setInitialized(true);
      }, (error) => {
        setError(error);
        console.error('Auth state change error:', error);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during Firebase initialization'));
      console.error('Firebase initialization error:', err);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-4">
          <div className="text-red-600 text-xl mb-2">Failed to initialize app</div>
          <div className="text-red-500">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider 
      value={{ 
        app, 
        auth, 
        db, 
        storage, 
        analytics, 
        initialized 
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}