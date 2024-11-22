import { Injectable } from '@angular/core';
import axios, { Axios, AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private urlBase = `${environment.apiUrl}/academica/turma`;

  constructor() {}

  async getTurmas(){
    const resposta = await axios.get(`${this.urlBase}/`)

    if(resposta.status == 200){
      return resposta.data
    }
  }

  async getTurmasDescricao() {
    const response = await axios.get(`${this.urlBase}/`);
    return response.data.map((turma: any) => ({
      ...turma,
      descricao: `${turma.ano} ${turma.letra}`,
    }));
  }

  async getTurmaById(id: number){
    const resposta = await axios.get(`${this.urlBase}/turma/${id}`)

    if(resposta.status == 200){
      return resposta.data
    }
  }

  async cadastrarTurma(escolaId: number, servidorId: number, ano: string, anoLetivo: string, letra: string){
    const resposta = await axios.post(`${this.urlBase}`, {
      "escolaId": escolaId,
      "servidorId": servidorId,
      "ano": `${ano}`,
      "anoLetivo": anoLetivo,
      "letra": letra
    })

    if(resposta.status == 201){
      return resposta.data
    }
  }

  async deletarTurma(turmaId: number){
    const resposta = await axios.delete(`${this.urlBase}/${turmaId}`)

    return resposta
  }
}
