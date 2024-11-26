import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { ContaBancaria } from './contaBancaria';

export interface MovimentacaoFinanceira {
  id: number;
  contaBancariaId: number;
  documentoScanId?: number;
  data?: Date;
  valor?: number;
  descricao?: string;
  tipo?: string;
  capitalCusteio?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  ContaBancaria?: ContaBancaria;
  DocumentosScan?: DocumentoScan;
}
