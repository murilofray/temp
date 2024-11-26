import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiClient } from 'src/app/interceptors/axios.interceptor'; // Supondo que exista um interceptador axios configurado

@Injectable({
  providedIn: 'root',
})
export class ProgramaService {
  private apiUrl = `${environment.apiUrl}/contas/programa`;

  constructor() {}

  // Método para cadastrar o programa
  async create(programa: any): Promise<any> {
    try {
      const resposta = await apiClient.post(this.apiUrl, programa);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao cadastrar programa:', error);
      throw error;
    }
  }

  // Método para atualizar o programa
  async update(programa: any): Promise<any> {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${programa.id}`, programa);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao atualizar programa:', error);
      throw error;
    }
  }

  // Método para obter programas por PDDE
  async getByPDDE(idPDDE: number): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/pdde/${idPDDE}`);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao buscar programas por PDDE:', error);
      throw error;
    }
  }
}
