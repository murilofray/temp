import { ServidorApm } from './servidorAPM';

export interface CargoAPM {
  id: number;
  descricao: string;
  ServidorApm?: ServidorApm[];
}
