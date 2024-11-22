import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private urlBase = `${environment.apiUrl}/docentes/professor`;
  constructor() {}

  async buscarDocentes() {
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
