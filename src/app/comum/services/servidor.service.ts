import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  private apiUrl = `${environment.apiUrl}/servidor/servidores`;

  constructor(private http: HttpClient) {}

  cadastrarServidor(servidor: any): Observable<any> {
    return this.http.post(this.apiUrl, servidor);
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  async buscarServidorPorId(id: number) {
    const resposta = await axios
      .get(`${this.apiUrl}/${id}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta.data;
  }

  async buscarServidoresPorEscola(escolaId: number) {
    const resposta = await axios
      .get(`${this.apiUrl}/escola/${escolaId}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta.data;
  }
}
