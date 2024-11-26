import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class PrestacaoContasService {
  private apiUrl = `/contas/prestacao`;

  constructor() {}

  async crete(prestacaoConta: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, prestacaoConta);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(prestacaoConta: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${prestacaoConta.id}`, prestacaoConta);
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

  async getById(id: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/id/${id}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByAnoPDDE(idPDDE: number, ano: number = new Date().getFullYear()): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/pdde/${idPDDE}?ano=${ano}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
