import { APM } from 'src/app/modulos/prestacao-contas/model/APM';
import { ContaBancaria } from 'src/app/modulos/prestacao-contas/model/contaBancaria';
import { OficioMemorando } from 'src/app/modulos/prestacao-contas/model/oficioMemorando';
import { PDDE } from 'src/app/modulos/prestacao-contas/model/PDDE';
import { TermoDoacao } from 'src/app/modulos/prestacao-contas/model/termoDoacao';
import { Imagens } from './imagem';
import { Telefone } from './telefone';
import { Servidor } from './servidor';
import { Ata } from 'src/app/modulos/prestacao-contas/model/ata';

export interface Escola {
  id: number;
  apmId?: number;
  imagensId?: number;
  nome: string;
  cnpj: string;
  inep: string;
  atoCriacao: string;
  endereco: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  imagens?: Imagens;
  apm?: APM;
  contaBancaria: ContaBancaria[];
  telefones: Telefone[];
  pdde: PDDE[];
  servidores: Servidor[];
  // turmas: Turma[];
  termoDoacao: TermoDoacao[];
  oficioMemorando: OficioMemorando[];
  ata: Ata[];
  // diretor?: Diretor;
}
