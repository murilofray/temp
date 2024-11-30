import { Servidor } from "./servidor";
import { NivelAcesso } from "./nivelAcesso";

export interface NivelAcessoServidor {
  servidorId: number;
  nivelAcessoId: number;
  diretorTemporario: boolean;
  Servidor: Servidor;
  Acesso: NivelAcesso;
}
