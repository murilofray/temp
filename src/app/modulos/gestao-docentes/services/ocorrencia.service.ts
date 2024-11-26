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

  async criarOcorrencia(ocorrenciaData: any) {
    const resposta = await axios
      .post(this.urlBase, ocorrenciaData)
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

  async editarOcorrencia(ocorrenciaData: any) {
    const resposta = await axios
      .put(`${this.urlBase}/${ocorrenciaData.id}`, ocorrenciaData)
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
    try {
      const resposta = await axios.get(`${this.urlBase}/deleted`);
      return {
        error: false,
        data: resposta.data || [],
      };
    } catch (err: AxiosError | any) {
      console.error('Erro ao buscar ocorrências deletadas:', err.response?.data || err.message);
      return {
        error: true,
        data: err.response?.data?.message || 'Erro desconhecido',
      };
    }
  }
  

  async atualizarStatusOcorrencia(id: number, status: string, aprovadoPor: number, motivoRecusa?: string) {
    const motivo = motivoRecusa ? motivoRecusa : '';
    const resposta = await axios
      .put(`${this.urlBase}/${id}/status`, { status, aprovadoPor, motivo })
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response.data.message,
      }));
  
    return resposta;
  }
  
  
}
