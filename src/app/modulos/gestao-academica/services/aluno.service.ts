import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = `${environment.apiUrl}/academica/aluno`;

  constructor() {}

  async getAlunoById(id: any) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar o aluno: ' + error.message);
    }
  }

  async getAllWithTurmaByServidor() {
    const token = localStorage.getItem('jwt');
    const decodedToken = this.parseJwt(token);

    try {
      const response = await axios.get(`${this.apiUrl}/servidor/${decodedToken.id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar o aluno: ' + error.message);
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

