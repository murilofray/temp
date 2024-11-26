
import { PesquisaPreco } from './pesquisaPreco';
import { PDDE } from './PDDE';

export interface PrestacaoContas {
  id: number;
  pDDEId: number;
  ano: number;
  entregue: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PDDE?: PDDE;
  PesquisaPreco?: PesquisaPreco[];
}
