import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NivelAcessoServidorService {
  private apiUrl = `${environment.apiUrl}/nivelAcesso/nivel-acesso-servidor`;

  constructor(private http: HttpClient) {}

  cadastrarNivelAcesso(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
