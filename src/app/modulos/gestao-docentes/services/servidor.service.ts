import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  private urlBase = `${environment.apiUrl}/docentes/servidor/`;
  constructor() {}

  async atualizarGrau(servidorId: number) {
    try {
      const response = await axios.patch(`${this.urlBase}${servidorId}/grau`);
      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message: string })?.message || 'Erro desconhecido';
      return {
        error: true,
        data: errorMessage,
      };
    }
  }
  

  async getAll() {
    try {
      const response = await axios.get(this.urlBase);
      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Erro desconhecido';
      return {
        error: true,
        data: errorMessage,
      };
    }
  }
}
