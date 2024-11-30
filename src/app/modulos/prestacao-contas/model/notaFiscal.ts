import { Fornecedor } from './fornecedor';
import { Item } from './item';
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
  Item?: Item[];
}
