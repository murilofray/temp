import { PesquisaPreco } from './pesquisaPreco';
import { NotaFiscal } from './notaFiscal';
import { TermoDoacao } from './termoDoacao';
import { PropostaItem } from './propostaItem';

export interface Item {
  id: number;
  pesquisaPrecoId: number;
  notaFiscalId?: number;
  termoDoacaoId?: number;
  descricao: string;
  menorValor?: number;
  quantidade: number;
  unidade: string;
  justificativa?: string;
  aprovado?: boolean;
  melhorProponente?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PesquisaPreco?: PesquisaPreco;
  NotaFiscal?: NotaFiscal;
  TermoDoacao?: TermoDoacao;
  PropostaItem?: PropostaItem[];
}
