import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApmService {
  private apiUrl = `${environment.apiUrl}/contas/apm`;

  constructor(private http: HttpClient) {}

  async create(apm: any) {
    try {
      const resposta = await apiClient.post(this.apiUrl, apm);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const resposta = await apiClient.get(this.apiUrl);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByEscola(escolaId: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/escola/${escolaId}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, apm: any) {
    try {
      const response = await apiClient.put(`${this.apiUrl}/${id}`, apm);
      return {
        success: true,
        message: 'APM atualizada com sucesso',
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao atualizar APM',
      };
    }
  }

  async delete(id: number) {
    try {
      const response = await apiClient.delete(`${this.apiUrl}/${id}`);
      return {
        success: true,
        message: 'APM excluída logicamente com sucesso',
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao excluir APM',
      };
    }
  }

  async getByEscolaDetails(idEscola: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/details/${idEscola}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
