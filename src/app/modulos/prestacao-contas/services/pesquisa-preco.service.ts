import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PesquisaPrecoService {
  private apiUrl = `${environment.apiUrl}/contas/pesquisa`;

  constructor() {}

  async create(pesquisaPreco: any) {
    try {
      const resposta = await axios.post(this.apiUrl, pesquisaPreco);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(pesquisaPreco: any) {
    try {
      const resposta = await axios.put(`${this.apiUrl}/${pesquisaPreco.id}`, pesquisaPreco);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const resposta = await axios.delete(`${this.apiUrl}/${id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getByPrestacao(idPrestacao: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/prestacao/${idPrestacao}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getByPrograma(idPrograma: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/programa/${idPrograma}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const resposta = await axios.get(`${this.apiUrl}/${id}`);
      return resposta.data;
    } catch (error) {
      throw error;
    }
  }
}
