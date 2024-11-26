import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { Escola } from 'src/app/comum/model/escola';

export interface Ata {
  id: number;
  escolaId: number;
  documentosScanId?: number;
  titulo: string;
  ata: string;
  data: Date;
  tipo: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola: Escola;
  DocumentosScan?: DocumentoScan;
}
