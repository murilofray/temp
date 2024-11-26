import { Injectable } from '@angular/core';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class OficioMemorandoService {
  private apiUrl = `/contas/ofimem`;

  constructor() {}

  async crete(ofiMem: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, ofiMem);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(ofiMem: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${ofiMem.id}`, ofiMem);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const resposta = await apiClient.delete(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getByEscola(idEscola: number, ano: number = new Date().getFullYear()): Promise<any> {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/escola/${idEscola}?ano=${ano}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
