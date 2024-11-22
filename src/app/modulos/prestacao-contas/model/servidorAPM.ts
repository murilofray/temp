import { Servidor } from 'src/app/comum/model/servidor';
import { APM } from './APM';
import { CargoAPM } from './cargoAPM';

export interface ServidorApm {
  servidorId: number;
  apmId: number;
  cargoAPMId: number;
  Servidor?: Servidor;
  APM?: APM;
  CargoAPM?: CargoAPM;
}
