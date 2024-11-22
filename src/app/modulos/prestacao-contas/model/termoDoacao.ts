import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { Escola } from 'src/app/comum/model/escola';
import { Bem } from './bem';

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
  Bem?: Bem[];
}
