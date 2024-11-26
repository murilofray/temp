import { PDDE } from './PDDE';

export interface SaldoPDDE {
  id: number;
  saldoPDDEId: number;
  valor: number;
  custeio: number;
  capital: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PDDE?: PDDE;
}
