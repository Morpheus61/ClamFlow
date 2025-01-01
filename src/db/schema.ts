import { Timestamp } from 'firebase/firestore';

// Base interfaces
export interface BaseDocument {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier extends BaseDocument {
  name: string;
  contact: string;
  licenseNumber: string;
}

export interface RawMaterial extends BaseDocument {
  supplierId: string;
  weight: number;
  date: string;
  status: 'pending' | 'assigned';
  lotNumber: string | null;
}

export interface DepurationData {
  status: 'pending' | 'in-progress' | 'completed';
  tankNumber: string;
  startTime: string;
  startReadings: {
    temperature: string;
    salinity: string;
  };
  endReadings?: {
    temperature: string;
    salinity: string;
  };
  completedAt?: string;
  duration: number;
}

export interface Lot extends BaseDocument {
  lotNumber: string;
  totalWeight: number;
  notes?: string;
  status: 'pending' | 'processing' | 'completed';
  depurationData?: DepurationData;
}

export interface ProcessingBatch extends BaseDocument {
  lotNumber: string;
  shellOnWeight: number;
  meatWeight: number;
  boxes: Array<{
    type: 'shell-on' | 'meat';
    weight: number;
    boxNumber: string;
    grade: string;
  }>;
  date: string;
  yieldPercentage: number;
  status: 'pending' | 'completed';
}

export interface ShellWeight extends BaseDocument {
  weight: number;
  date: string;
  notes?: string;
}

export interface Package extends BaseDocument {
  lotNumber: string;
  type: 'shell-on' | 'meat';
  weight: number;
  boxNumber: string;
  grade: string;
  qrCode: string;
  date: string;
}

export interface ProductGrade extends BaseDocument {
  code: string;
  name: string;
  description: string;
  productType: 'shell-on' | 'meat';
}