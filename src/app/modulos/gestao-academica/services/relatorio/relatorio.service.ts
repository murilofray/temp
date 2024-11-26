import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private urlBase = environment.apiUrl + '/academica/relatorios';

  constructor() { }

  async downloadRelatorioBeneficiarios(turmaId: number, escolaId: number) {
    try {
      const query = (turmaId == -1 || !turmaId)
        ? `?escolaId=${escolaId}`
        : `?turmaId=${turmaId}&escolaId=${escolaId}`;

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

  async printRelatorioBeneficiarios(turmaId: number, escolaId: number) {
    try {
      const query = (turmaId == -1 || !turmaId)
        ? `?escolaId=${escolaId}`
        : `?turmaId=${turmaId}&escolaId=${escolaId}`;

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

  async downloadRelatorioMeninosMeninas(turmaId: number, escolaId: number) {
    try {
      const query = (turmaId == -1 || !turmaId)
        ? `?escolaId=${escolaId}`
        : `?turmaId=${turmaId}&escolaId=${escolaId}`;

      const response = await axios.get(`${this.urlBase}/meninos_meninas${query}`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'relatorio_meninos_meninas.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async printRelatorioMeninosMeninas(turmaId: number, escolaId: number) {
    try {
      const query = (turmaId == -1 || !turmaId)
        ? `?escolaId=${escolaId}`
        : `?turmaId=${turmaId}&escolaId=${escolaId}`;

      const response = await axios.get(`${this.urlBase}/meninos_meninas${query}`, {
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

  async downloadRelatorioBairros(escolaId: number) {
    try {
      const query = '?escolaId=' + escolaId;

      const response = await axios.get(`${this.urlBase}/bairros${query}`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'relatorio_bairros.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async downloadRelatorioDistribuicaoRacialAlunos(escolaId: number) {
    try {
      const response = await axios.get(`${this.urlBase}/alunos/raca/${escolaId}`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const dateNow = new Date().toDateString()

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_distribuicao_racial_${dateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async downloadRelatorioDistribuicaoRacialAlunosParaAdmin() {
    try {
      const response = await axios.get(`${this.urlBase}/alunos/admin/raca`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const dateNow = new Date().toDateString()

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_distribuicao_racial_escola_${dateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async downloadRelatorioBairrosParaAdmin() {
    try {
      const response = await axios.get(`${this.urlBase}/alunos/admin/bairros`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const dateNow = new Date().toDateString()

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_distribuicao_bairros_escola_${dateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async downloadRelatorioMeninosEMeninasParaAdmin() {
    try {
      const response = await axios.get(`${this.urlBase}/alunos/admin/meninos_meninas`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const dateNow = new Date().toDateString()

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_distribuicao_meninos_meninas_escola_${dateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async downloadRelatorioBeneficiariosParaAdmin() {
    try {
      const response = await axios.get(`${this.urlBase}/alunos/admin/beneficiarios`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const dateNow = new Date().toDateString()

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_distribuicao_beneficiarios_escola_${dateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }
}
