import { Injectable } from '@angular/core';
import { aB } from '@fullcalendar/core/internal-common';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoService {
  private urlBase = environment.apiUrl + '/docentes/configuracao';

  constructor() {}

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }
  async criarConfiguracao(configuracaoData: any) {
    const resposta = await axios
      .post(this.urlBase, configuracaoData)
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

  async deletarConfiguracao(id: number) {
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

  async editarConfiguracao(configuracaoData: any) {
    const resposta = await axios
      .put(`${this.urlBase}/${configuracaoData.id}`, configuracaoData)
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
