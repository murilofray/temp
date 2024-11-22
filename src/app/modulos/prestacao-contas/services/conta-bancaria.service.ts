import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ContaBancariaService {
  private apiUrl = `${environment.apiUrl}/contas/contaBancaria`;

  constructor(private http: HttpClient) {}

  async getById(id: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  // Método para cadastrar a conta bancária
  create(contaBancaria: any): Observable<any> {
    return this.http.post(this.apiUrl, contaBancaria);
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  listarIdContaBancaria(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id);
  }
}
