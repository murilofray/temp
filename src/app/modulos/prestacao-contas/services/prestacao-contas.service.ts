import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrestacaoContasService {
  private apiUrl = `${environment.apiUrl}/contas/prestacao`;

  constructor(private http: HttpClient) {}

  async crete(bem: any) {
    try {
      const resposta = await this.http.post(`${this.apiUrl}`, bem).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(bem: any) {
    try {
      const resposta = await this.http.put(`${this.apiUrl}/${bem.id}`, bem).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const resposta = await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<any> {
    try {
      const resposta = await this.http.get(`${this.apiUrl}/id/${id}`).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getByAnoPDDE(idPDDE: number, ano: number = new Date().getFullYear()): Promise<any> {
    try {
      const resposta = await this.http.get(`${this.apiUrl}/pdde/${idPDDE}?ano=${ano}`).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
