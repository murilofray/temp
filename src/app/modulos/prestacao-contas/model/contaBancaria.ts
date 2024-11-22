import { SaldoBancario } from './saldoBancario';
import { MovimentacaoFinanceira } from './movimentacaoBancaria';
import { PDDE } from './PDDE';
import { Escola } from 'src/app/comum/model/escola';

export interface ContaBancaria {
  id: number;
  escolaId: number;
  agencia: string;
  numeroConta: string;
  banco: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola?: Escola;
  SaldoBancario?: SaldoBancario[];
  MovimentacaoBancaria?: MovimentacaoFinanceira[];
  PDDE?: PDDE[];
}
