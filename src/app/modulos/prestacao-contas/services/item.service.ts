import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = `/contas/item`;

  constructor() {}

  async create(item: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, item);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(item: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${item.id}`, item);
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

  async createPropostaItem(propostaItem: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}/proposta`, propostaItem);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
  async updatePropostaItem(propostaItem: any) {
    try {
      const resposta = await apiClient.put(
        `${this.apiUrl}/proposta/${propostaItem.itemId}/${propostaItem.fornecedorId}`,
        propostaItem,
      );
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePropostaItem(propostaItem: any) {
    try {
      const resposta = await apiClient.delete(
        `${this.apiUrl}/proposta/${propostaItem.itemId}/${propostaItem.fornecedorId}`,
        propostaItem,
      );
      return resposta.data;
    } catch (error) {
    }
  }
}
