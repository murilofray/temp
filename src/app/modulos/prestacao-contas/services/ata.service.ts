import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AtaService {
  private apiUrl = `${environment.apiUrl}/contas/ata`;

  constructor(private http: HttpClient) {}

  createAta(ataData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ataData);
  }

  getAtas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
