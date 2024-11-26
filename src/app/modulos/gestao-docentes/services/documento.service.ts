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


  async downloadPDF(caminho: string) {
    // URL do endpoint para download

    const url = `http://localhost:3333/api/doc/download?docPath=${caminho}`;

    // Faz a requisição para o backend usando axios.get
    axios
      .get(url, {
        // Configura para receber a resposta como um blob
        responseType: 'blob',
      })
      .then((response) => {
        // Cria um link temporário para iniciar o download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        link.download = caminho + '.pdf'; // Nome do arquivo ao salvar
        link.click(); // Simula o clique para baixar o arquivo
        window.URL.revokeObjectURL(link.href); // Limpa a URL criada
      })
      .catch((error) => {
        console.error('Erro ao baixar o documento:', error);
      });
  }



  
}
