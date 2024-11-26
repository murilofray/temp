import { ServidorApm } from 'src/app/modulos/prestacao-contas/model/servidorAPM';
import { Escola } from './escola';
import { Diretor } from './diretor';

export interface Servidor {
  id: number;
  escolaId?: number;
  nome: string;
  rg: string;
  cpf: string;
  dataContratacao?: Date;
  categoria?: string;
  grau?: string;
  pontuacaoAnual?: number;
  anoDaUltimaProgressaoPorAssiduidade?: number;
  anoDaUltimaProgressaoPorTitulo?: number;
  anoDoUltimoQuinquenio?: number;
  email?: string;
  senha?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  escola?: Escola;
  diretor?: Diretor;
  servidorApm: ServidorApm[];
  // ocorrencias: Ocorrencia[];
  // progressao: Progressao[];
  // titulos: Titulo[];
  // quinquenios: Quinquenio[];
  // niveisAcessoServidor: NivelAcessoServidor[];
  // turmas: Turma[];
  // questionarios: Questionario[];
  // questionariosAluno: QuestionarioAluno[];
}
