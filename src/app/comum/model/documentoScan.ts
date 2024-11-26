import { Ata } from 'src/app/modulos/prestacao-contas/model/ata';
import { MovimentacaoFinanceira } from 'src/app/modulos/prestacao-contas/model/movimentacaoBancaria';
import { NotaFiscal } from 'src/app/modulos/prestacao-contas/model/notaFiscal';
import { OficioMemorando } from 'src/app/modulos/prestacao-contas/model/oficioMemorando';
import { PesquisaPreco } from 'src/app/modulos/prestacao-contas/model/pesquisaPreco';
import { TermoDoacao } from 'src/app/modulos/prestacao-contas/model/termoDoacao';
import { TipoDocumento } from './tipoDocumento';

export interface DocumentoScan {
  id: number;
  tipoDocumentoId: number;
  caminho: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  TipoDocumento?: TipoDocumento;
  MovimentacaoFinanceira?: MovimentacaoFinanceira[];
  Ata?: Ata[];
  NotaFiscal?: NotaFiscal[];
  // AlunoDocumentos?: AlunoDocumento[];
  TermoDoacao?: TermoDoacao[];
  OficioMemorando?: OficioMemorando[];
  // Ocorrencia?: Ocorrencia[];
  // Titulo?: Titulo[];

  // Relacionamentos com PesquisaPreco
  PesquisaPrecoA?: PesquisaPreco[];
  PesquisaPrecoB?: PesquisaPreco[];
  PesquisaPrecoC?: PesquisaPreco[];
}
