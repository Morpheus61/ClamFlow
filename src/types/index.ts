export interface Supplier {
  id?: number;
  name: string;
  contact: string;
  licenseNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawMaterial {
  id?: number;
  supplierId: number;
  weight: number;
  date: string;
  status: 'pending' | 'assigned';
  lotNumber: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lot {
  id?: number;
  lotNumber: string;
  totalWeight: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessingBatch {
  id?: number;
  lotNumber: string;
  shellOnWeight: number;
  meatWeight: number;
  shellWeight: number;
  date: string;
  status: 'pending' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Package {
  id?: number;
  lotNumber: string;
  boxNumber: string;
  type: 'shell-on' | 'meat';
  weight: number;
  grade: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}