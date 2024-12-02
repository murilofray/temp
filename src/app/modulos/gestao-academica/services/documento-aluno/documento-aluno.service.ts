import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoAlunoService {
  private urlBase = `${environment.apiUrl}/doc`;
  

  constructor() {}

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async indexComDeletados() {
    const resposta = await axios.get(`${this.urlBase}/deleted`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async findById(id: number) {
    const resposta = await axios.get(`${this.urlBase}/id/${id}`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async create(tipoDocumentoId: number, caminho: string, pdf: File, descricao: string) {
    const formData = new FormData();
    formData.append('caminho', caminho);
    formData.append('pdf', pdf);
    formData.append('tipoDocumentoId', tipoDocumentoId.toString());
    formData.append('descricao', descricao);

    const resposta = await axios
      .post(this.urlBase, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((data) => {
        return { error: false, data: data.data };
      })
      .catch((err) => {
        return { error: true, data: err.response.data.message };
      });

    return resposta;
  }

  async update(id: number, pdf: File) {
    const formData = new FormData();
    formData.append('pdf', pdf);

    const resposta = await axios
      .put(`${this.urlBase}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((data) => {
        return { error: false, data: data.data };
      })
      .catch((err) => {
        return { error: true, data: err.response.data.message };
      });

    return resposta;
  }

  async delete(id: number) {
    const resposta = await axios
      .delete(`${this.urlBase}/${id}`)
      .then((data) => {
        return { error: false, data: data.data };
      })
      .catch((err) => {
        return { error: true, data: err.response.data.message };
      });

    return resposta;
  }

  async recover(id: number) {
    const resposta = await axios
      .get(`${this.urlBase}/recover/${id}`)
      .then((data) => {
        return { error: false, data: data.data };
      })
      .catch((err) => {
        return { error: true, data: err.response.data.message };
      });

    return resposta;
  }

  async getDocumentosByAlunoId(alunoId: number) {
    const resposta = await axios.get(`${this.urlBase}/aluno/${alunoId}`);

    if (resposta.status === 200) {
      return resposta.data; // Retorna a lista de documentos do aluno
    }else{
      return null;
    }
  }

  verPDF(caminho: string){
    const pdfUrl = `${environment.docsApiURL}${caminho}`;
    window.open(pdfUrl, '_blank');
  }

}
