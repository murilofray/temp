import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/doc`;

  constructor(private http: HttpClient) {}

  getDocumentosScan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/atas`);
  }

  getDocumentoCaminho(documentosScanId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${documentosScanId}`);
  }

  createDocumentoScan(documentoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, documentoData);
  }

  async create(documento: any) {
    try {
      const resposta = await axios.post(this.apiUrl, documento);
      return resposta as any;
    } catch (error) {
      throw error;
    }
  }
}
