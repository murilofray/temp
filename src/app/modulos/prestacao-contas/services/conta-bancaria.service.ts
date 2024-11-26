import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiClient } from 'src/app/interceptors/axios.interceptor'; // Supondo que exista um interceptador axios configurado

@Injectable({
  providedIn: 'root',
})
export class ContaBancariaService {
  private apiUrl = `${environment.apiUrl}/contas/contaBancaria`;

  constructor() {}

  // Método para buscar conta bancária pelo ID
  async getById(id: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao buscar conta bancária:', error);
      throw error;
    }
  }

  // Método para cadastrar uma conta bancária
  async create(contaBancaria: any): Promise<any> {
    try {
      const resposta = await apiClient.post(this.apiUrl, contaBancaria);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao cadastrar conta bancária:', error);
      throw error;
    }
  }

  // Método para listar todas as contas bancárias
  async getAll(): Promise<any[]> {
    try {
      const resposta = await apiClient.get(this.apiUrl);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao listar contas bancárias:', error);
      throw error;
    }
  }

  // Método para listar conta bancária por ID
  async listarIdContaBancaria(id: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao buscar conta bancária por ID:', error);
      throw error;
    }
  }

  // Método para listar contas por escola
  async listarContasPorEscola(escolaId: number): Promise<any[]> {
    try {
      const url = `${this.apiUrl}/escola/${escolaId}`;
      const resposta = await apiClient.get(url);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao listar contas por escola:', error);
      throw error;
    }
  }
}
