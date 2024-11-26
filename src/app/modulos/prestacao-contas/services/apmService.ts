import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApmService {
  private apiUrl = `${environment.apiUrl}/contas/apm`;

  constructor(private http: HttpClient) {}

  cadastrarApm(apm: any): Observable<any> {
    return this.http.post(this.apiUrl, apm);
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  async buscarApmPorId(id: number) {
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
          data: err.response?.data?.message || 'Erro ao buscar APM',
        };
      });

    return resposta;
  }

  async buscarApmsPorEscola(escolaId: number) {
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
          data: err.response?.data?.message || 'Erro ao buscar APMs',
        };
      });

    return resposta;
  }

  async atualizarApm(id: number, apm: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, apm);
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

  async excluirApmLogicamente(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
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
}
