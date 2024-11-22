export const NivelAcessoEnum = {
  ADMINISTRADOR: {
    id: 1,
    descricao: 'ADMINISTRADOR',
  },
  DIRETOR: {
    id: 2,
    descricao: 'DIRETOR',
  },
  VICE_DIRETOR: {
    id: 3,
    descricao: 'VICE_DIRETOR',
  },
  COORDENADOR: {
    id: 4,
    descricao: 'COORDENADOR',
  },
  ESCRITUARIO: {
    id: 5,
    descricao: 'ESCRITUARIO',
  },
  DOCENTE: {
    id: 6,
    descricao: 'DOCENTE',
  },
  APM: {
    id: 7,
    descricao: 'APM',
  },
} as const;

export type NivelAcessoEnum = (typeof NivelAcessoEnum)[keyof typeof NivelAcessoEnum];
