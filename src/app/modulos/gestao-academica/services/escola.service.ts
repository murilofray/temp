import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EscolaService {
  private apiUrl = `${environment.apiUrl}/escola`;

  constructor() {}

  async getEscolas() {
    try {
      const response = await axios.get(`${this.apiUrl}/`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar as escolas: ' + error.message);
    }
  }

  async createEscola(escola: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/`, escola);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao inserir a escola: ' + error.message);
    }
  }

  async deleteEscola(id: any) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar a escola: ' + error.message);
    }
  }

  async getEscolaById(id: any) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar a escola: ' + error.message);
    }
  }

  async updateEscola(escola: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${escola.id}`, escola);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar a escola: ' + error.message);
    }
  }
}

