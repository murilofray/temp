import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoFinanceiraService {
  private apiUrl = `${environment.apiUrl}/contas/movimentacao`;

  constructor() {}

  async crete(movimentacaoFinanceira: any) {
    try {
      const resposta = await axios.post(`${this.apiUrl}`, movimentacaoFinanceira);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(movimentacaoFinanceira: any) {
    try {
      const resposta = await axios.put(`${this.apiUrl}/${movimentacaoFinanceira.id}`, movimentacaoFinanceira);
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

  async getById(id: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recupera uma lista de movimentações relacionadas a uma conta bancária específica.
   *
   * @param idConta - O identificador único da conta bancária.
   * @param ano - O ano para filtrar as movimentações. Se não fornecido, usará o ano atual.
   * @returns Uma Promise que resolve para um array de movimentações relacionadas à conta bancária especificada.
   * @throws Lançará um erro se a solicitação falhar.
   */
  async getByContaBancaria(idConta: number, ano: number = new Date().getFullYear()) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/conta/${idConta}?ano=${ano}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
