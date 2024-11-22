import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GerirAtaService {
  private apiUrl = `${environment.apiUrl}/contas/gerirAta`;

  constructor(private http: HttpClient) {}

  create(ataData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ataData);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
