import { add } from '../db';
import { useNotification } from './useNotification';
import { COLLECTIONS } from '../db';

interface RawMaterialData {
  supplierId: string;
  weight: number;
  photoUrl: string;
  date: Date;
}

export function useRawMaterialSubmit() {
  const { addNotification } = useNotification();

  const submit = async (data: RawMaterialData) => {
    try {
      await add(COLLECTIONS.RAW_MATERIALS, {
        ...data,
        status: 'pending',
        lotNumber: null
      });

      addNotification('success', 'Raw material entry created successfully');
      return true;
    } catch (error) {
      console.error('Error creating raw material entry:', error);
      addNotification('error', 'Failed to create raw material entry');
      throw error;
    }
  };

  return { submit };
}