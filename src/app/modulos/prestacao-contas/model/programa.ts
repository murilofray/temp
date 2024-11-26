import { PDDE } from './PDDE';
import { PrestacaoContas } from './prestacaoContas';

export interface Programa {
  id: number;
  pddeId: number;
  nome: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PDDE?: PDDE;
  PrestacaoContas?: PrestacaoContas[];
}
