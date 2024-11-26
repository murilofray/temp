import { ContaBancaria } from './contaBancaria';

export interface SaldoBancario {
  id: number;
  contaBancariaId: number;
  saldo: number;
  data: Date;
  createdAt: Date;
  ContaBancaria?: ContaBancaria;
}
