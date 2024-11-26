import { PesquisaPreco } from './pesquisaPreco';
import { NotaFiscal } from './notaFiscal';
import { PropostaServico } from './propostaServico';

export interface Servico {
  id: number;
  pesquisaPrecoId: number;
  notaFiscalId?: number;
  descricao: string;
  menorValor?: number;
  justificativa?: string;
  aprovado?: boolean;
  melhorProponente?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PesquisaPreco?: PesquisaPreco;
  NotaFiscal?: NotaFiscal;
  PropostaServico?: PropostaServico[];
}
