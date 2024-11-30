import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  private apiUrl = `${environment.apiUrl}/servidor/servidores`;

  constructor(private http: HttpClient) {}

  cadastrarServidor(servidor: any): Observable<any> {
    return this.http.post(this.apiUrl, servidor);
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  async buscarServidorPorId(id: number) {
    const resposta = await axios
      .get(`${this.apiUrl}/${id}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta.data;
  }

  async buscarServidoresPorEscola(escolaId: number) {
    const resposta = await axios
      .get(`${this.apiUrl}/escola/${escolaId}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta.data;
  }

  async redefinirSenha(id: number, senhaAtual: string, novaSenha: string) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}/redefinir-senha`, {
        senhaAtual,
        novaSenha,
      });
      return {
        success: true,
        message: 'Senha redefinida com sucesso',
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao redefinir senha',
      };
    }
  }

  async buscarServidoresExcetoAPM() {
    const niveisExcetoAPM = ['ADMINISTRADOR', 'DIRETOR', 'VICE_DIRETOR', 'COORDENADOR', 'ESCRITUARIO', 'DOCENTE'];

    try {
      const response = await axios.get(`${this.apiUrl}/nivel-acesso`, {
        params: { niveis: niveisExcetoAPM.join(',') },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar servidores',
      };
    }
  }

  async buscarServidoresAPM() {
    const niveisExcetoAPM = ['APM'];

    try {
      const response = await axios.get(`${this.apiUrl}/nivel-acesso`, {
        params: { niveis: niveisExcetoAPM.join(',') },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar servidores',
      };
    }
  }

  // Vou 
  async buscarServidorPorNivelAcessoAndEscola(escolaId: number, nivelAcessoId: number) {
    const resposta = await axios
      .get(`${this.apiUrl}/escola/${escolaId}/${nivelAcessoId}`)
      .then((data) => {
        return {
          error: false,
          data: data.data,
        };
      })
      .catch((err) => {
        return {
          error: true,
          data: err.response.data.message,
        };
      });

    return resposta.data;
  }

  async atualizarServidorComNiveisAcesso(id: number, servidor: any, niveisAcesso: number[]) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, {
        ...servidor,
        niveisAcesso,
      });
  
      return {
        success: true,
        message: 'Servidor atualizado com sucesso',
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data.error || 'Já existe um email com o mesmo valor cadastrado.',
        };
      }
  
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao atualizar o servidor',
      };
    }
  }

  async deletarServidor(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return {
        success: true,
        message: 'Servidor deletado com sucesso',
        data: response.data,
      };
    } catch (error: AxiosError | any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao deletar o servidor',
      };
    }
  }

}
