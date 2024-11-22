import { DocumentoScan } from 'src/app/comum/model/documentoScan';

export interface Ata {
  id: number;
  documentosScanId?: number;
  titulo: string;
  ata: string;
  data: Date;
  tipo: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  DocumentosScan?: DocumentoScan;
}
