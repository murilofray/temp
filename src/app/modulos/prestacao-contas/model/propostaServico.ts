import { Fornecedor } from './fornecedor';
import { Servico } from './servico';

export interface PropostaServico {
  servicoId: number;
  fornecedorId: number;
  orcamentoId?: number;
  valor: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Servico?: Servico;
  Fornecedor?: Fornecedor;
}
