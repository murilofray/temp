import { Escola } from "./escola";
import { Servidor } from "./servidor";

export interface Turma {
    id: number;
    escolaId: number;
    servidorId: number;
    anoLetivo: number | null;
    ano: number | null;
    letra: string | null;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    Escola: Escola;
    Servidor: Servidor;
    descricao?: string;
  }