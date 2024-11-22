import { NotaFiscal } from './notaFiscal';
import { PropostaBem } from './propostaBem';
import { PropostaServico } from './propostaServico';

export interface Fornecedor {
  id: number;
  cnpj?: string;
  cpf?: string;
  cidade: string;
  endereco: string;
  responsavel: string;
  nomeFantasia: string;
  telefone: string;
  email?: string;
  razaoSocial: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  NotaFiscal?: NotaFiscal[];
  PropostaBem?: PropostaBem[];
  PropostaServico?: PropostaServico[];
}
