import { Escola } from "./escola";

export interface Imagens {
    id: number;
    caminho: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    escolas: Escola[];
  }
