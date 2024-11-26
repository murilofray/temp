import { PesquisaPreco } from './pesquisaPreco';
import { NotaFiscal } from './notaFiscal';
import { TermoDoacao } from './termoDoacao';
import { PropostaBem } from './propostaBem';

export interface Bem {
  id: number;
  pesquisaPrecoId: number;
  notaFiscalId?: number;
  termoDoacaoId?: number;
  descricao: string;
  menorValor?: number;
  quantidade: number;
  justificativa?: string;
  aprovado?: boolean;
  melhorProponente?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PesquisaPreco?: PesquisaPreco;
  NotaFiscal?: NotaFiscal;
  TermoDoacao?: TermoDoacao;
  PropostaBem?: PropostaBem[];
}
