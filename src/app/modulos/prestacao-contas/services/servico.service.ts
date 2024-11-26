import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private apiUrl = `/contas/servico`;

  constructor() {}

  async create(servico: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, servico);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(servico: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${servico.id}`, servico);
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

  async getByPesquisa(idPesquisa: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/pesquisa/${idPesquisa}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async createPropostaServico(propostaServico: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}/proposta`, propostaServico);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
  async updatePropostaServico(propostaServico: any) {
    try {
      const resposta = await apiClient.put(
        `${this.apiUrl}/proposta/${propostaServico.servicoId}/${propostaServico.fornecedorId}`,
        propostaServico,
      );
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePropostaServico(propostaServico: any) {
    try {
      const resposta = await apiClient.delete(
        `${this.apiUrl}/proposta/${propostaServico.servicoId}/${propostaServico.fornecedorId}`,
        propostaServico,
      );
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
