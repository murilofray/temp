import { Servidor } from 'src/app/comum/model/servidor';
import { FormacaoAPM } from './formacaoAPM';
import { CargoAPMTEnum } from 'src/app/enums/CargoAPMEnum';

export interface ServidorAPM {
  servidorId: number;
  formacaoId: number;
  cargoAPMId: CargoAPMTEnum;
  Servidor: Servidor;
  FormacaoAPM: FormacaoAPM;
}
