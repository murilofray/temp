import { Escola } from 'src/app/comum/model/escola';

export interface APM {
  id: number;
  cnpj: string;
  nome: string;
  dataFormacao: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola?: Escola;
}
