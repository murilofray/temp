import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionarioAlunoService {
  private apiUrl = `${environment.apiUrl}/academica/questionario-aluno`;

  constructor() {}

  async getQuestionariosAluno() {
    try {
      const response = await axios.get(`${this.apiUrl}/`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar as questionários: ' + error.message);
    }
  }

  async createQuestionarioAluno(questionarioAluno: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/`, questionarioAluno);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao inserir a questionário: ' + error.message);
    }
  }

  async getQuestionarioAlunoById(id: any) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar a questionário: ' + error.message);
    }
  }

  async getQuestionarioAlunoByAlunoId(alunoId: any) {
    try {
      const response = await axios.get(`${this.apiUrl}/aluno/${alunoId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar a questionário: ' + error.message);
    }
  }

  async deleteQuestionarioAluno(id: any) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar a questionário: ' + error.message);
    }
  }
}

