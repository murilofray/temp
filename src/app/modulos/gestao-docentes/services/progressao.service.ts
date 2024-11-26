import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgressaoService {
  private urlBase = `${environment.apiUrl}/docentes/progressao`;

  constructor() {}

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }

  async createProgressao(progressaoData: any) {
    try {
      const response = await axios.post(this.urlBase, progressaoData);
      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { resposta: string })?.resposta || 'Erro ao criar progressão';
      return {
        error: true,
        data: errorMessage,
      };
    }
  }

  async getByServidorId(servidorId: number) {
    try {
      const response = await axios.get(`${this.urlBase}/servidorId/${servidorId}`);
      return { error: false, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Erro desconhecido';
      return { error: true, data: errorMessage };
    }
  }

  async criarProgressao(
    servidorId: number,
    data: Date,
    tipo: string,
    aprovado: boolean | null,
    detalhes: string | null,
    aprovadoPor: number | null,
  ) {
    try {
      const resposta = await axios.post(this.urlBase, {
        servidorId: servidorId,
        data: data,
        tipo: tipo,
        aprovado: aprovado,
        detalhes: detalhes,
        aprovadoPor: aprovadoPor,
      });
      return { error: false, data: resposta.data };
    } catch (error: any) {
      return { error: true, data: error.response.data.message };
    }
  }

  async deletarProgressao(id: number) {
    try {
      const resposta = await axios.delete(`${this.urlBase}/${id}`);
      return { error: false, data: resposta.data };
    } catch (error: any) {
      return { error: true, data: error.response.data.message };
    }
  }

  async editarProgressao(
    id: number,
    servidorId: number,
    data: Date,
    tipo: string,
    aprovado: boolean | null,
    detalhes: string | null,
    aprovadoPor: number | null,
  ) {
    try {
      const resposta = await axios.put(`${this.urlBase}/${id}`, {
        servidorId: servidorId,
        data: data,
        tipo: tipo,
        aprovado: aprovado,
        detalhes: detalhes,
        aprovadoPor: aprovadoPor,
      });
      return { error: false, data: resposta.data };
    } catch (error: any) {
      return { error: true, data: error.response.data.message };
    }
  }

  async buscarProgressoesDoServidor(servidorId: number) {
    try {
      const resposta = await axios.get(`${this.urlBase}/servidorId/${servidorId}`);
      return { error: false, data: resposta.data };
    } catch (error: any) {
      return { error: true, data: error.response.data.message };
    }
  }
}
