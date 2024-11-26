import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionarioService {
  private apiUrl = `${environment.apiUrl}/academica/questionario`;

  constructor() {}

  async getQuestionarios() {
    const token = localStorage.getItem('jwt');
    const decodedToken = this.parseJwt(token);

    try {
      const response = await axios.get(`${this.apiUrl}/?servidorId=${decodedToken.id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar as questionários: ' + error.message);
    }
  }

  async getQuestionariosTodasEscolas() {
    try {
      const response = await axios.get(`${this.apiUrl}/`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar as questionários: ' + error.message);
    }
  }

  async createQuestionario(questionario: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/`, questionario);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao inserir a questionário: ' + error.message);
    }
  }

  async deleteQuestionario(id: any) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar a questionário: ' + error.message);
    }
  }

  async getQuestionarioById(id: any) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar a questionário: ' + error.message);
    }
  }

  async updateQuestionario(questionario: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${questionario.id}`, questionario);

      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar a questionário: ' + error.message);
    }
  }

  parseJwt(token: string): any {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];

      const decodedPayload = atob(payload);

      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erro ao decodificar o JWT:', error);
      return null;
    }
  }
}

