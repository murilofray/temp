import { PrestacaoContas } from './prestacaoContas';
import { Bem } from './bem';
import { Servico } from './servico';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { Programa } from './programa';

export interface PesquisaPreco {
  id: number;
  prestacaoContasId: number;
  tipo: string;
  titulo: string;
  proponenteA: number;
  orcamentoA: number;
  proponenteB: number;
  orcamentoB: number;
  proponenteC: number;
  orcamentoC: number;
  programaId?: number;
  consolidado: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  PrestacaoContas?: PrestacaoContas;
  DocumentoScanA?: DocumentoScan;
  DocumentoScanB?: DocumentoScan;
  DocumentoScanC?: DocumentoScan;
  Programa?: Programa;
  Bem?: Bem[];
  Servico?: Servico[];
}
