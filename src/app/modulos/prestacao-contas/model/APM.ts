import { Escola } from 'src/app/comum/model/escola';
import { ServidorApm } from './servidorAPM';

export interface APM {
  id: number;
  vigente: number;
  dataFormacao: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola?: Escola[];
  ServidorApm?: ServidorApm[];
}
