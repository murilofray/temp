import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaService {
  private urlBase = environment.apiUrl + '/docentes/ocorrencia';

  constructor() {}

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }

  async criarOcorrencia(
    servidorId: number,
    abonoId: number | null,
    lancadoPor: number | null,
    status: string | null,
    dataOcorrencia: Date,
    descricao: string | null,
    aprovadoPor: number | null,
  ) {
    const resposta = await axios
      .post(this.urlBase, {
        servidorId: servidorId,
        abonoId: abonoId,
        lancadoPor: lancadoPor,
        status: status,
        dataOcorrencia: dataOcorrencia,
        descricao: descricao,
        aprovadoPor: aprovadoPor,
        createAt: new Date(),
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

  async deletarOcorrencia(id: number) {
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

  async editarOcorrencia(
    id: number,
    servidorId: number,
    abonoId: number | null,
    lancadoPor: number,
    status: string | null,
    dataOcorrencia: Date,
    descricao: string | null,
    aprovadoPor: number | null,
  ) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        servidorId: servidorId,
        abonoId: abonoId,
        lancadoPor: lancadoPor,
        status: status,
        dataOcorrencia: dataOcorrencia,
        descricao: descricao,
        aprovadoPor: aprovadoPor,
        updatedAt: new Date(),
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

  async buscarOcorrenciasDoServidor(servidorId: number) {
    const resposta = await axios
      .get(`${this.urlBase}/servidorId/${servidorId}`)
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

  async buscarOcorrenciaPorId(id: number) {
    const resposta = await axios
      .get(`${this.urlBase}/${id}`)
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

  async buscarOcorrenciasDeletadas() {
    const resposta = await axios
      .get(`${this.urlBase}/deleted`)
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

  async atualizarStatusOcorrencia(id: number, status: string) {
    const resposta = await axios
      .patch(`${this.urlBase}/${id}/status`, { status })
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
