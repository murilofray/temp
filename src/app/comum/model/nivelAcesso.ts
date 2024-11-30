import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { NivelAcessoServidor } from './nivelAcessoServidor';

export interface NivelAcesso {
  id: number;
  descricao: NivelAcessoEnum;
  ServidorAcesso: NivelAcessoServidor;
}
