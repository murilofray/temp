import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor() { }

  getUserInfo() {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      const user = decodedToken['servidor']

      return {
        user: user,
        niveisAcesso: user.NivelAcessoServidor
      }
    }

    return null
  }

  podeRealizarEssaFuncao(niveisUsuario: { nivelAcessoId: number }[], niveisNecessarios: NivelAcessoEnum[]) {
    return niveisUsuario.some(nivelUsuario => 
      niveisNecessarios.some(nivelNecessario => nivelUsuario.nivelAcessoId === nivelNecessario.id)
    );
  }
}