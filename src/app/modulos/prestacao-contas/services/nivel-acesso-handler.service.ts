import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NivelAcessoServidor } from 'src/app/comum/model/nivelAcessoServidor';
import { NivelAcessoEnum as nae } from 'src/app/enums/NivelAcessoEnum';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível globalmente
})
export class NivelAcessoHandler {
  constructor() {}

  // Função que recebe o JWT e retorna o nivelAcessoId
  extrairNivelAcessoId(tokenJWT: string): number | null {
    if (!tokenJWT || typeof tokenJWT !== 'string') {
      console.error('Token JWT inválido ou não fornecido.');
      return null;
    }

    try {
      const decodedToken = JSON.parse(atob(tokenJWT.split('.')[1])); // Decodifica o token
      const nivelAcessoServidor = decodedToken.servidor?.NivelAcessoServidor;

      if (nivelAcessoServidor && Array.isArray(nivelAcessoServidor) && nivelAcessoServidor.length > 0) {
        return nivelAcessoServidor[0]?.nivelAcessoId || null; // Retorna o nivelAcessoId ou null
      }

      console.error('Nível de acesso não encontrado no token JWT.');
      return null;
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  }

  /**
   * Verifica se o usuário logado possui nível de acesso como gestor.
   * Os níveis de acesso considerados gestores são: DIRETOR, VICE_DIRETOR, ESCRITUARIO e COORDENADOR.
   *
   * @returns {boolean} - Retorna `true` se o usuário possuir algum dos níveis de acesso listados, caso contrário, retorna `false`.
   *
   * @example
   * // Exemplo de uso:
   * if (isGestor()) {
   *   console.log("Usuário é gestor!");
   * } else {
   *   console.log("Usuário não é gestor.");
   * }
   */
  isGestor(): boolean {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
    const niveisAcessoServidor = decodedToken['servidor'].NivelAcessoServidor;
    return niveisAcessoServidor.some(
      (acesso: any) =>
        acesso.Acesso.descricao === nae.DIRETOR.descricao ||
        acesso.Acesso.descricao === nae.VICE_DIRETOR.descricao ||
        acesso.Acesso.descricao === nae.ESCRITUARIO.descricao ||
        acesso.Acesso.descricao === nae.COORDENADOR.descricao,
    );
  }

  /**
   * Verifica se o usuário logado possui exclusivamente o nível de acesso de APM (Associação de Pais e Mestres).
   *
   * @returns {boolean} - Retorna `true` se todos os níveis de acesso do usuário forem apenas APM, caso contrário, retorna `false`.
   *
   * @example
   * // Exemplo de uso:
   * if (isApenasAPM()) {
   *   console.log("Usuário possui apenas nível de acesso APM.");
   * } else {
   *   console.log("Usuário possui outros níveis de acesso.");
   * }
   */
  isApenasAPM(): boolean {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
    const niveisAcessoServidor = decodedToken['servidor'].NivelAcessoServidor;
    return niveisAcessoServidor.every((acesso: any) => acesso.Acesso.descricao === nae.APM.descricao);
  }
}
