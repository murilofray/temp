import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaCertificadoService {
  private urlBase = environment.apiUrl + '/docentes/categoriaCertificado';

  constructor() {}

  async listarCategorias() {
    const resposta = await axios
      .get(`${this.urlBase}`)
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response?.data?.message || 'Erro ao listar categorias',
      }));
    console.log(resposta);
    return resposta;
  }

  async criarCategoriaCertificado(
    nome: string,
    pontosPorHora: number | null,
    horasMinimas: number | null,
    horasMaximas: number | null
  ) {
    const resposta = await axios
      .post(this.urlBase, {
        nome: nome,
        pontosPorHora: pontosPorHora,
        horasMinimas: horasMinimas,
        horasMaximas: horasMaximas,
      })
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response?.data?.message || 'Erro ao criar categoria',
      }));

    return resposta;
  }

  async deletarCategoriaCertificado(id: number) {
    const resposta = await axios
      .delete(`${this.urlBase}/${id}`)
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response?.data?.message || 'Erro ao deletar categoria',
      }));

    return resposta;
  }

  async editarCategoriaCertificado(
    id: number,
    nome: string,
    pontosPorHora: number | null,
    horasMinimas: number | null,
    horasMaximas: number | null
  ) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        nome: nome,
        pontosPorHora: pontosPorHora,
        horasMinimas: horasMinimas,
        horasMaximas: horasMaximas,
      })
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response?.data?.message || 'Erro ao editar categoria',
      }));

    return resposta;
  }

  async buscarCategoriaPorId(id: number) {
    const resposta = await axios
      .get(`${this.urlBase}/id/${id}`)
      .then((data) => ({
        error: false,
        data: data.data,
      }))
      .catch((err) => ({
        error: true,
        data: err.response?.data?.message || 'Erro ao buscar categoria por ID',
      }));

    return resposta;
  }
}
