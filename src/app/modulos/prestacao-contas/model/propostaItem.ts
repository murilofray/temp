import { Item } from './item';
import { Fornecedor } from './fornecedor';

export interface PropostaItem {
  itemId: number;
  fornecedorId: number;
  orcamentoId?: number;
  valor: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  Item?: Item;
  Fornecedor?: Fornecedor;
}
