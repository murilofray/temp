import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BemService {
  private apiUrl = `${environment.apiUrl}/contas/bem`;

  constructor() {}

  async crete(bem: any) {
    try {
      const resposta = await axios.post(`${this.apiUrl}`, bem);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(bem: any) {
    try {
      const resposta = await axios.put(`${this.apiUrl}/${bem.id}`, bem);
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

  async getByPesquisa(idPesquisa: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/pesquisa/${idPesquisa}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async createPropostaBem(propostaBem: any) {
    try {
      const resposta = await axios.post(`${this.apiUrl}/proposta`, propostaBem);
      return resposta;
    } catch (error) {
      throw error;
    }
  }
  async updatePropostaBem(propostaBem: any) {
    try {
      const resposta = await axios.put(
        `${this.apiUrl}/proposta/${propostaBem.bemId}/${propostaBem.fornecedorId}`,
        propostaBem,
      );

      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async deletePropostaBem(propostaBem: any) {
    try {
      const resposta = await axios.delete(
        `${this.apiUrl}/proposta/${propostaBem.bemId}/${propostaBem.fornecedorId}`,
        propostaBem,
      );

      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
