import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlergiaService {
  private urlBase = environment.apiUrl + '/academica/alergia';

  constructor() { }

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }

  async criarAlergia(descricao: string, tipo: number | null) {
    const resposta = await axios
      .post(this.urlBase, {
        descricao: descricao,
        tipo: tipo,
      })
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err: any) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }

  async deletarAlergia(id: number) {
    const resposta = await axios
      .delete(`${this.urlBase}/${id}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }

  async editarAlergia(id: number, descricao: string) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        descricao: descricao,
      })
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta;
  }

  async downloadRelatorioAlergia(tipoAlergiaId: number, escolaId: number | null) {
    try {
      // Construindo a query para tipoAlergiaId
      const tipoAlergiaQuery = tipoAlergiaId == -1 || !tipoAlergiaId ? '' : `?tipoAlergiaId=${tipoAlergiaId}`;

      // Se escolaId não for null, adiciona o parâmetro escolaId na query
      const escolaQuery = escolaId !== null ? (tipoAlergiaQuery ? `&escolaId=${escolaId}` : `?escolaId=${escolaId}`) : '';

      // Combina as queries
      const query = tipoAlergiaQuery + escolaQuery;

      const response = await axios.get(`${this.urlBase}/relatorio${query}`, {
        responseType: 'blob', // Recebendo como Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'relatorio_alergia.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  }

  async printRelatorioAlergia(tipoAlergiaId: number, escolaId: number | null) {
    try {

      // Construindo a query para tipoAlergiaId
      const tipoAlergiaQuery = tipoAlergiaId == -1 || !tipoAlergiaId ? '' : `?tipoAlergiaId=${tipoAlergiaId}`;

      // Se escolaId não for null, adiciona o parâmetro escolaId na query
      const escolaQuery = escolaId !== null ? (tipoAlergiaQuery ? `&escolaId=${escolaId}` : `?escolaId=${escolaId}`) : '';

      // Combina as queries
      const query = tipoAlergiaQuery + escolaQuery;

      const response = await axios.get(`${this.urlBase}/relatorio${query}`, {
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

  async getAlergiasByAlunoId(alunoId: number) {
    try {
      const resposta = await axios.get(`${this.urlBase}/aluno/${alunoId}/alergias`);

      if (resposta.status === 200) {
        return resposta.data; // Retorna as alergias do aluno
      }
    } catch (error) {
      return {
        error: true,
        data: error.response ? error.response.data.message : 'Erro ao obter alergias.',
      };
    }
  }
}
