import { APM } from './APM';
import { ServidorAPM } from './servidorAPM';

export interface FormacaoAPM {
  id: number;
  apmId: number;
  dataInicio: Date;
  dataTermino: Date;
  vigencia: boolean;
  createdAt: Date;
  updatedAt?: Date;
  ServidorAPM: ServidorAPM[];
  APM: APM;
}
