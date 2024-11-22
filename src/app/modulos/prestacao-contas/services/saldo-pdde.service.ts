import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaldoPDDEService {
  private apiUrl = `${environment.apiUrl}/contas/saldoPDDE`;

  constructor(private http: HttpClient) {}

  create(saldoPdde: any): Observable<any> {
    return this.http.post(this.apiUrl, saldoPdde);
  }
}
