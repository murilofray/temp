import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class MembroApmService {
  private apiUrl = `${environment.apiUrl}/contas/membroAPM`;

  constructor(private http: HttpClient) {}

  // Método para cadastrar um novo Membro da APM
  cadastrarMembroAPM(membroAPM: any): Observable<any> {
    return this.http.post(this.apiUrl, membroAPM);
  }

}
