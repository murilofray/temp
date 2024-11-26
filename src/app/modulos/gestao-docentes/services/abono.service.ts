import { Injectable } from '@angular/core';
import { aB } from '@fullcalendar/core/internal-common';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AbonoService {
  private urlBase = environment.apiUrl + '/docentes/abono';

  constructor() {}

  async index() {
    const resposta = await axios.get(`${this.urlBase}`);
    return resposta.status === 200 ? resposta.data : [];
  }

  async criarAbono(nome: string, abona: boolean, maximoDiasAno: number, maximoDiasMes: number,) {
    const resposta = await axios
      .post(this.urlBase, {
        nome: nome,
        abona: abona,
        maximoDiasAno: maximoDiasAno,
        maximoDiasMes: maximoDiasMes,
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

  async deletarAbono(id: number) {
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
    console.log(resposta);
    return resposta;
  }

  async editarAbono(id: number, nome: string, abona: boolean, maximoDiasAno: number, maximoDiasMes: number) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        nome: nome,
        abona: abona,
        maximoDiasAno: maximoDiasAno,
        maximoDiasMes: maximoDiasMes,
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

  async buscarAbonoPorId(id: number) {
    const resposta = await axios
      .get(`${this.urlBase}/id/${id}`)
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

    return resposta.data;
  }
}
