import { Escola } from './escola';
import { Servidor } from './servidor';

export interface Diretor {
  escolaId: number;
  servidorId: number;
  servidor: Servidor;
  escola: Escola;
}
