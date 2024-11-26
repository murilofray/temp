import { Injectable } from '@angular/core';

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
}
