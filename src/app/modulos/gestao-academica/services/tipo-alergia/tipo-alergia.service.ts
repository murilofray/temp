import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoAlergiaService {
  private urlBase = environment.apiUrl + '/academica/tipo-alergia';

  constructor() {}

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }

  async cadastrar(descricao: string) {
    const resposta = await axios
      .post(this.urlBase, {
        descricao: descricao,
      })
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err: any) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }

  async deletar(id: number) {
    const resposta = await axios
      .delete(`${this.urlBase}/${id}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }

  async editar(id: number, descricao: string) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        descricao: descricao,
      })
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }
}
