import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class BemService {
  private apiUrl = `/contas/bem`;

  constructor() {}

  async create(bem: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, bem);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(bem: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${bem.id}`, bem);
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

  async getByPesquisa(idPesquisa: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/pesquisa/${idPesquisa}`);
      return resposta.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createPropostaBem(propostaBem: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}/proposta`, propostaBem);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
  async updatePropostaBem(propostaBem: any) {
    try {
      const resposta = await apiClient.put(
        `${this.apiUrl}/proposta/${propostaBem.bemId}/${propostaBem.fornecedorId}`,
        propostaBem,
      );
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePropostaBem(propostaBem: any) {
    try {
      const resposta = await apiClient.delete(
        `${this.apiUrl}/proposta/${propostaBem.bemId}/${propostaBem.fornecedorId}`,
        propostaBem,
      );
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
