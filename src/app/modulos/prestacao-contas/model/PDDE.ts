// import {Escola} from '';
import { Escola } from 'src/app/comum/model/escola';
import { ContaBancaria } from './contaBancaria';
import { PrestacaoContas } from './prestacaoContas';
import { Programa } from './programa';
import { SaldoPDDE } from './saldoPDDE';

export interface PDDE {
  id: number;
  escolaId: number;
  contaBancariaId: number;
  tipo: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola?: Escola;
  ContaBancaria?: ContaBancaria;
  Programa?: Programa[];
  PrestacaoConta?: PrestacaoContas[];
  SaldoPDDE?: SaldoPDDE[];
}
