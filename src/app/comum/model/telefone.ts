import { Escola } from './escola';

export interface Telefone {
  id: number;
  numero: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  escolaId: number;
  escola: Escola;
}
