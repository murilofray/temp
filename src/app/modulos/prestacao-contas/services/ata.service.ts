import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiClient } from 'src/app/interceptors/axios.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AtaService {
  private apiUrl = `${environment.apiUrl}/contas/ata`;

  constructor(private http: HttpClient) {}

  async create(ata: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, ata);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async update(ata: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${ata.id}`, ata);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByEscola(idEscola: number, ano: number = new Date().getFullYear()) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/escola/${idEscola}?ano=${ano}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async createAta(ataData: any) {
    try {
      const resposta = await apiClient.post(`${this.apiUrl}`, ataData);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getAtas() {
    try {
      const resposta = await apiClient.get<any[]>(this.apiUrl);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAta(id: number, ata: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${id}`, ata);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
