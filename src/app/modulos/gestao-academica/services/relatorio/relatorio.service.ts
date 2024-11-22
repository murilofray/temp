import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private urlBase = environment.apiUrl + '/academica/relatorios';

  constructor() { }

  async downloadRelatorioBeneficiarios(turmaId: number) {
    try {
      const query = turmaId == -1 || !turmaId ? '' : '?turmaId=' + turmaId;

      const response = await axios.get(`${this.urlBase}/beneficiarios${query}`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'relatorio_beneficiarios.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async printRelatorioBeneficiarios(turmaId: number) {
    try {
      const query = turmaId === -1 || !turmaId ? '' : '?turmaId=' + turmaId;

      const response = await axios.get(`${this.urlBase}/beneficiarios${query}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const newTab = window.open(url);

      newTab.onload = () => {
        newTab.print();
        window.URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }
}
