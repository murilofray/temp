import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiClient } from 'src/app/interceptors/axios.interceptor'; // Supondo que exista um interceptador axios configurado

@Injectable({
  providedIn: 'root',
})
export class SaldoPDDEService {
  private apiUrl = `${environment.apiUrl}/contas/saldoPDDE`;

  constructor() {}

  // Método para criar um saldo PDDE
  async create(saldoPdde: any): Promise<any> {
    try {
      const resposta = await apiClient.post(this.apiUrl, saldoPdde);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao criar saldo PDDE:', error);
      throw error;
    }
  }
}
