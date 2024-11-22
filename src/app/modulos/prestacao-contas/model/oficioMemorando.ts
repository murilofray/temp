import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { Escola } from 'src/app/comum/model/escola';

export interface OficioMemorando {
  id: number;
  escolaId: number;
  documentoScanId?: number; // Referência opcional
  titulo: string;
  tipo: string;
  data: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Escola: Escola; // Referência ao modelo Escola
  DocumentosScan?: DocumentoScan; // Referência ao modelo DocumentoScan
}
