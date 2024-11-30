export const UnidadeEnum = {
  UNIDADE: {
    nome: 'Unidade',
    sigla: 'un.',
  },
  METRO: {
    nome: 'Metro',
    sigla: 'm',
  },
  QUILOGRAMA: {
    nome: 'Quilograma',
    sigla: 'kg',
  },
  LITRO: {
    nome: 'Litro',
    sigla: 'L',
  },
  HORA: {
    nome: 'Hora',
    sigla: 'h',
  },
  METRO_QUADRADO: {
    nome: 'Metro Quadrado',
    sigla: 'm²',
  },
  METRO_CUBICO: {
    nome: 'Metro Cúbico',
    sigla: 'm³',
  },
} as const;

export type UnidadeEnum = (typeof UnidadeEnum)[keyof typeof UnidadeEnum];
