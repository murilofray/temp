import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class PesquisaPrecoService {
  private apiUrl = `/contas/pesquisa`;

  constructor() {}

  async create(pesquisaPreco: any) {
    try {
      const resposta = await apiClient.post(this.apiUrl, pesquisaPreco);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(pesquisaPreco: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${pesquisaPreco.id}`, pesquisaPreco);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const resposta = await apiClient.delete(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByPrestacao(idPrestacao: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/prestacao/${idPrestacao}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByPrograma(idPrograma: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/programa/${idPrograma}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta.data.data;
    } catch (error) {
      throw error;
    }
  }
}
