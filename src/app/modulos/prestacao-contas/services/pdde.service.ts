import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PDDEService {
  private apiUrl = `${environment.apiUrl}/contas/pdde`;

  constructor(private http: HttpClient) {}

  cadastrarPdde(pddeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pddeData);
  }

  listarTodosPDDEs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  listarComSaldo(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/saldo');
  }
  async getById(id: number) {
    try {
      const resposta = await this.http.get(`${this.apiUrl}/${id}`).toPromise();
      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
