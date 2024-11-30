import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { DocumentoAlunoService } from '../documento-aluno/documento-aluno.service';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private urlBase = `${environment.apiUrl}/academica/aluno`;

  constructor(private documentoAlunoService: DocumentoAlunoService) { }

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getActiveAlunos() {
    const resposta = await axios.get(`${this.urlBase}/ativos`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getDisabledAlunos(){
    const resposta = await axios.get(`${this.urlBase}/desabilitados`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async criarAluno(
    nome: string,
    dataNascimento: Date,
    nomeMae: string | null,
    celular: string | null,
    ra: string,
    cpf: string,
    sexo: string,
    raca: string,
    beneficiarioBF: boolean,
    logradouro: string,
    cep: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
    alergiaIds: number[],
    documentos: { tipoDocumentoId: number; caminho: string; pdf: File, descricao: string }[],
  ) {
    // Lista para armazenar os IDs dos documentos criados
    const documentosCriadosIds: number[] = [];
    try {
      for (const doc of documentos) {
        const respostaDocumento = await this.documentoAlunoService.create(doc.tipoDocumentoId, doc.caminho, doc.pdf, doc.descricao);

        if (respostaDocumento.error) {
          throw new Error(`Erro ao salvar o documento: ${respostaDocumento.data}`);
        }

        // Armazena o ID do documento criado para possível exclusão em caso de erro na criação do aluno
        documentosCriadosIds.push(respostaDocumento.data.id);
      }

      //tenta criar o aluno
      const resposta = await axios.post(this.urlBase, {
        nome,
        dataNascimento,
        nomeMae,
        celular,
        ra,
        cpf,
        sexo,
        raca,
        beneficiarioBF,
        logradouro,
        cep,
        numero,
        bairro,
        cidade,
        uf,
        alergiaIds,
        documentosCriadosIds,
      });

      return {
        error: false,
        data: 'Aluno e documentos cadastrados com sucesso!',
      };
    } catch (err) {
      // remove todos os documentos criados anteriormente
      for (const id of documentosCriadosIds) {
        await this.documentoAlunoService.delete(id);
      }

      return {
        error: true,
        data: err.response ? err.response.data.message : err.message,
      };
    }
  }

  async deletarAluno(id: number) {
    const resposta = await axios
      .delete(`${this.urlBase}/${id}`)
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

    return resposta;
  }
  
  async editarAluno(id: number, isDisabled: boolean) {
    const resposta = await axios
      .put(`${this.urlBase}/${id}`, {
        isDisabled,
      })
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

    return resposta;
  }

  async update(
    id: number,
    nome: string,
    nomeMae: string | null,
    sexo: string,
    raca: string,
    beneficiarioBF: boolean,
    logradouro: string,
    cep: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
  ) {
    try {
      const resposta = await axios.put(`${this.urlBase}/${id}`, {
        nome,
        nomeMae,
        sexo,
        raca,
        beneficiarioBF,
        logradouro,
        cep,
        numero,
        bairro,
        cidade,
        uf,
      });

      return {
        error: false,
        data: 'Aluno atualizado com sucesso!',
      };
    } catch (err) {
      return {
        error: true,
        data: err.response ? err.response.data.message : err.message,
      };
    }
  }

  async getById(id: number) {
    const resposta = await axios.get(`${this.urlBase}/${id}`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getByNome(nome: string) {
    const resposta = await axios.get(`${this.urlBase}/nome/${nome}`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getByRA(ra: string) {
    const resposta = await axios.get(`${this.urlBase}/ras/${ra}`);
    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getByRAUnique(ra: string) {
    const resposta = await axios.get(`${this.urlBase}/ra/${ra}`);
    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async adicionarAlergias(alunoId: number, alergiaIds: number[]) {
    try {
      const response = await axios.post(`${this.urlBase}/${alunoId}/alergias`, {
        alergiaIds: alergiaIds,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return {
        error: true,
        data: error.response.data.message,
      };
    }
  }

  async adicionarDocumento(alunoId: number, tipoDocumentoId: number, caminho: string, pdf: File, descricao: string) {
    let documentoCriadoId: number | null = null;
    try {
      // Tenta criar o documento
      const respostaDocumento = await this.documentoAlunoService.create(tipoDocumentoId, caminho, pdf, descricao);
      // Armazena o ID do documento criado para possível exclusão
      documentoCriadoId = respostaDocumento.data.id;
      // Tenta criar a relação do documento com o aluno
      const response = await axios.post(`${this.urlBase}/${alunoId}/documento`, {
        documentoId: documentoCriadoId,
      });
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      // Caso ocorra um erro, deleta o documento criado, se existir
      if (documentoCriadoId !== null) {
        await this.documentoAlunoService.delete(documentoCriadoId);
      }
      return {
        error: true,
        data: error.response ? error.response.data.message : error.message,
      };
    }
  }

  async getAlunosByTurmaId(id: number) {
    const resposta = await axios.get(`${this.urlBase}/alunos/${id}`).then((data) => {
      return data.data
    }).catch((err) => {
      return []
    })

    return resposta
  }

  async getAlunosSemTurma() {
    const resposta = await axios.get(`${this.urlBase}/alunos/turma/inativos/`).then((data) => {
      return data.data
    }).catch((err) => {
      return []
    })

    return resposta
  }

  async realizarMatricula(turmaId: number, alunoId: number) {
    try {
      const response = await axios.post(`${this.urlBase}/matricular`, {
        turmaId,
        alunoId,
      });

      if (response.status === 200) {
        // Sucesso
        return {
          success: true,
          message: 'Matrícula realizada com sucesso!',
          data: response.data,
        };
      } else {
        return {
          success: false,
          message: 'Ocorreu um problema inesperado.',
        };
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          return {
            success: false,
            message: 'Turma ou aluno não encontrados.',
          };
        } else if (status === 500) {
          return {
            success: false,
            message: 'Erro interno do servidor. Tente novamente mais tarde.',
          };
        }
      }

      // Erros de conexão, timeouts, etc.
      return {
        success: false,
        message: 'Erro na comunicação com o servidor. Verifique sua conexão.',
      };
    }
  };

  async getAlunosByEscola(escolaId: number) {
    const resposta = await axios
      .get(`${this.urlBase}/alunos/escola/${escolaId}`)
      .then((response) => {
        return response.data.map((aluno: any) => ({
          ...aluno,
          turmaDescricao: `${aluno.Turma.ano} ${aluno.Turma.letra} ${aluno.Turma.anoLetivo}`,
        }));
      })
      .catch((err) => {
        return [];
      });

    return resposta
  }

  async desvincularAlunoDaTurma(alunoId: number) {
    const resposta = await axios.post(`${this.urlBase}/alunos/turma/desvincular`, {
      alunoId
    }).then((response) => {
      if (response.status == 200) {
        return {
          success: true,
          message: "Aluno desvinculado com sucesso."
        }
      } else {
        return {
          success: false,
          message: 'Ocorreu um problema inesperado.',
        };
      }
    }).catch((error) => {
      const { status, data } = error.response;

      if (status === 400) {
        return {
          success: false,
          message: 'Ocorreu um problema inesperado.',
        };
      } else if (status === 500) {
        return {
          success: false,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
        };
      }

      return {
        success: false,
        message: 'Erro na comunicação com o servidor. Verifique sua conexão.',
      };
    })

    return resposta
  }


  async desabilitarAluno(alunoId: number){
    const resposta = await axios.delete(`${this.urlBase}/desabilitar/${alunoId}`).then((response) => {
      if (response.status == 200) {
        return {
          success: true,
          message: "Aluno desvinculado com sucesso."
        }
      } else {
        return {
          success: false,
          message: 'Ocorreu um problema inesperado.',
        };
      }
    }).catch((error) => {
      const { status, data } = error.response;

      if (status === 400) {
        return {
          success: false,
          message: 'Ocorreu um problema inesperado.',
        };
      } else if (status === 500) {
        return {
          success: false,
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
        };
      }

      return {
        success: false,
        message: 'Erro na comunicação com o servidor. Verifique sua conexão.',
      };
    })

    return resposta
  }
}