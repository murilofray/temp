import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiClient } from 'src/app/interceptors/axios.interceptor'; // Supondo que exista um interceptador axios configurado

@Injectable({
  providedIn: 'root',
})
export class PDDEService {
  private apiUrl = `${environment.apiUrl}/contas/pdde`;

  constructor() {}

  // Método para cadastrar PDDE
  async cadastrarPdde(pddeData: any): Promise<any> {
    try {
      const resposta = await apiClient.post(this.apiUrl, pddeData);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao cadastrar PDDE:', error);
      throw error;
    }
  }

  // Método para listar todos os PDDEs
  async listarTodosPDDEs(): Promise<any[]> {
    try {
      const resposta = await apiClient.get(this.apiUrl);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao listar PDDEs:', error);
      throw error;
    }
  }

  // Método para listar PDDEs com saldo por escola
  async listarComSaldoPorEscola(escolaId: number): Promise<any[]> {
    try {
      const url = `${this.apiUrl}/listarPorEscola/${escolaId}`;
      const resposta = await apiClient.get(url);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao listar PDDEs por escola:', error);
      throw error;
    }
  }

  // Método para listar PDDEs com saldo
  async listarComSaldo(): Promise<any[]> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/saldo`);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao listar PDDEs com saldo:', error);
      throw error;
    }
  }

  // Método para obter PDDE por ID
  async getById(id: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao obter PDDE por ID:', error);
      throw error;
    }
  }
}