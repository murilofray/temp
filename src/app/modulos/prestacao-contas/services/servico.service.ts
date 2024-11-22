import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private apiUrl = `${environment.apiUrl}/contas/servico`;

  constructor() {}

  async crete(servico: any) {
    try {
      const resposta = await axios.post(`${this.apiUrl}`, servico);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(servico: any) {
    try {
      const resposta = await axios.put(`${this.apiUrl}/${servico.id}`, servico);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const resposta = await axios.delete(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getByPesquisa(idPesquisa: number): Promise<any> {
    try {
      const resposta = await axios.get(`${this.apiUrl}/pesquisa/${idPesquisa}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async createPropostaBem(propostaServico: any) {
    try {
      const resposta = await axios.post(`${this.apiUrl}/proposta`, propostaServico);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
  async updatePropostaServico(propostaServico: any) {
    try {
      const resposta = await axios.put(
        `${this.apiUrl}/proposta/${propostaServico.servicoId}/${propostaServico.fornecedorId}`,
        propostaServico,
      );
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async deletePropostaServico(propostaServico: any) {
    try {
      const resposta = await axios.delete(
        `${this.apiUrl}/proposta/${propostaServico.servicoId}/${propostaServico.fornecedorId}`,
        propostaServico,
      );
      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
