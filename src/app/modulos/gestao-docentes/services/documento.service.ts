import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/doc`;

  constructor(private http: HttpClient) {}

  getDocumentosScan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/titulos`);
  }

  getDocumentoCaminho(documentosScanId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${documentosScanId}`);
  }

  getDocumentoVencimento(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/1`);
  }

  createDocumentoScan(documentoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, documentoData);
  }
}
