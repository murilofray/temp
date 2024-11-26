import { Turma } from "./turma";

export interface Aluno {
    id: number;
    nome: string;
    nomeMae: string;
    dataNascimento: Date;
    ra: string;
    celular: string;
    sexo: string;
    raca: string;
    cpf: string;
    beneficiarioBF: boolean;
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    alergias: any[];
    documentos: {
      certidaoNascimento: string,
      comprovanteResidencia: string,
      nis: string,
      rg: string,
      cpf: string,
      declaracaoVacinacao: string,
      autodeclaracaoRacial: string,
      documentosResponsavel: string[],
      laudos: string[]
    };
    Turma?: Turma
    turmaId: number;
  }