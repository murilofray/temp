import { Bem } from './bem';
import { Fornecedor } from './fornecedor';

export interface PropostaBem {
  bemId: number;
  fornecedorId: number;
  orcamentoId?: number;
  valor: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Bem?: Bem;
  Fornecedor?: Fornecedor;
}
