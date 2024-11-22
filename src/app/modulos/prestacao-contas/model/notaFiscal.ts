import { Fornecedor } from './fornecedor';
import { Bem } from './bem';
import { Servico } from './servico';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';

export interface NotaFiscal {
  id: number;
  fornecedorId: number;
  documentoScanId?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  DocumentosScan?: DocumentoScan;
  Fornecedor?: Fornecedor;
  Bem?: Bem[];
  Servico?: Servico[];
}
