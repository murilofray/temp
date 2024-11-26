import { Escola } from './escola';

export interface Servidor {
    id: number;
    escolaId: number;
    nome: string;
    rg: string;
    cpf: string;
    dataContratacao: string;
    categoria: string | null;
    grau: string | null;
    pontuacaoAnual: number | null;
    pontuacaoAssiduidade: number | null;
    email: string;
    senha: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    Escola: Escola;
  }