import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { Escola } from 'src/app/comum/model/escola';
import { Item } from './item';

export interface TermoDoacao {
  id: number;
  escolaId: number;
  documentoScanId?: number;
  conteudo: string;
  data: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola?: Escola;
  DocumentosScan?: DocumentoScan;
  Item?: Item[];
}
