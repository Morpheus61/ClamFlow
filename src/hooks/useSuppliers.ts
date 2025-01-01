import { useQuery } from '@tanstack/react-query';
import { getSuppliers } from '../db';
import type { Supplier } from '../types';

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: getSuppliers
  });
}