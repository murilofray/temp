import { Injectable } from '@angular/core';
import axios from 'axios';
import { apiClient } from 'src/app/interceptors/axios.interceptor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private apiUrl = `/contas/fornecedor`;

  constructor() {}

  async findAll() {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}`);
      return resposta;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async create(fornecedor: any) {
    try {
      const resposta = await apiClient.post(this.apiUrl, fornecedor);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async update(fornecedor: any) {
    try {
      const resposta = await apiClient.put(`${this.apiUrl}/${fornecedor.id}`, fornecedor);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um Fornecedor existente ou cria um novo se o ID não for fornecido.
   *
   * @param fornecedor - O objeto Fornecedor a ser atualizado ou criado.
   * @returns Uma Promessa que resolve para a resposta do servidor.
   * @throws Lança um erro se a solicitação falhar.
   */
  async updateOrCreate(fornecedor: any) {
    try {
      const url = fornecedor.id ? `${this.apiUrl}/upsert/${fornecedor.id}` : `${this.apiUrl}/upsert`;
      const resposta = await apiClient.put(`${url}`, fornecedor);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async delete(fornecedor: any) {
    try {
      const resposta = await apiClient.delete(`${this.apiUrl}/${fornecedor.id}`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async getByPesquisa(idPesquisa: number) {
    try {
      const resposta = await apiClient.get(`${this.apiUrl}/pesquisa/${idPesquisa}`);
      return resposta.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um Fornecedor pelo documento (CNPJ ou CPF) e retorna a resposta do servidor.
   *
   * @param documento - O documento do Fornecedor a ser buscado (CNPJ ou CPF).
   * @returns Uma Promessa que resolve para a resposta do servidor contendo dados do Fornecedor.
   * @throws Lança um erro se a solicitação falhar.
   * @remarks Se o documento for um CNPJ, a solicitação será feita para a rota `/cnpj/{documento}`.
   *          Se o documento for um CPF, a solicitação será feita para a rota `/cpf/{documento}`.
   */
  async getByDoc(documento: string) {
    let resposta;
    try {
      if (documento.length == 14) {
        resposta = apiClient.get(`${this.apiUrl}/cnpj/${documento}`);
      } else {
        resposta = apiClient.get(`${this.apiUrl}/cpf/${documento}`);
      }
      return resposta;
    } catch (error) {
      throw error;
    }
  }
}
