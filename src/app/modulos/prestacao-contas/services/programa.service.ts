import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProgramaService {
  private apiUrl = `${environment.apiUrl}/contas/programa`;

  constructor(private http: HttpClient) {}

  // Método para cadastrar o programa
  create(programa: any): Observable<any> {
    return this.http.post(this.apiUrl, programa);
  }

  update(programa: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${programa.id}`, programa);
  }

  async getByPDDE(idPDDE: number): Promise<any> {
    try {
      const resposta = await axios.get(`${this.apiUrl}/pdde/${idPDDE}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
