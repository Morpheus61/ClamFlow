import { useEffect } from 'react';
import { useOfflineStorage } from './useOfflineStorage';
import { db } from '../db';

export function useOfflineSync() {
  const { pendingUploads, removePendingUpload } = useOfflineStorage();

  useEffect(() => {
    const syncData = async () => {
      if (!navigator.onLine) return;

      for (const upload of pendingUploads) {
        try {
          switch (upload.type) {
            case 'rawMaterial':
              await db.add('rawMaterials', upload.data);
              break;
            case 'processing':
              await db.add('processingBatches', upload.data);
              break;
            case 'packaging':
              await db.add('packages', upload.data);
              break;
          }
          removePendingUpload(upload.id);
        } catch (error) {
          console.error('Error syncing offline data:', error);
        }
      }
    };

    window.addEventListener('online', syncData);
    syncData(); // Initial sync attempt

    return () => {
      window.removeEventListener('online', syncData);
    };
  }, [pendingUploads, removePendingUpload]);
}