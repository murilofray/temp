import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EscolaService {
  private urlBase = `${environment.apiUrl}/escola`;

  constructor() {}

  async getEscolas() {
    const resposta = await axios.get(`${this.urlBase}/`);

    if (resposta.status == 200) {
      return resposta.data;
    }
  }

  async getById(id: number) {
    try {
      const resposta = await axios.get(`${this.urlBase}/${id}`);
      if (resposta.status == 200) {
        return resposta.data;
      }
    } catch (error) {
      throw error;
    }
  }
}
