// Serviço para gerenciar títulos, agora com métodos para aceitar e recusar.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TituloService {
  private apiUrl = `${environment.apiUrl}/docentes/titulo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(tituloData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tituloData);
  }

  update(tituloId: number, tituloData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tituloId}`, tituloData);
  }

  delete(tituloId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${tituloId}`);
  }

  // Método para aceitar um título
  aceitar(tituloId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tituloId}`, { status: 'Aceito' });
  }

  // Método para recusar um título
  recusar(tituloId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tituloId}`, { status: 'Não Aceito' });
  }

  restaurar(tituloId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tituloId}`, { status: 'Aguardando Aprovação' });
  }

  getDeleted(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/deletedAt`);
  }
}
