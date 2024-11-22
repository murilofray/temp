export const TipoDocumentoEnum = {
  ATA_ASSINADA: {
    id: 1,
    tipo: 'ATA_ASSINADA',
    caminho: 'atas/',
  },
  CERTIDAO_NASCIMENTO: {
    id: 2,
    descricao: 'CERTIDAO_NASCIMENTO',
    caminho: 'certidoes/',
  },
  NOTA_FISCAL: {
    id: 3,
    descricao: 'NOTA_FISCAL',
    caminho: 'notas_fiscais/',
  },
  ORCAMENTO: {
    id: 4,
    descricao: 'ORCAMENTO',
    caminho: 'orcamentos/',
  },
  RECIBO: {
    id: 5,
    descricao: 'RECIBO',
    caminho: 'recibos/',
  },
  NIS: {
    id: 6,
    descricao: 'NIS',
    caminho: 'nis/',
  },
  LAUDO: {
    id: 7,
    descricao: 'LAUDO',
    caminho: 'laudos/',
  },
  ATESTADO: {
    id: 8,
    descricao: 'ATESTADO',
    caminho: 'atestados/',
  },
  CERTIFICADO: {
    id: 9,
    descricao: 'CERTIFICADO',
    caminho: 'certificados/',
  },
  MEMORANDO: {
    id: 10,
    descricao: 'MEMORANDO',
    caminho: 'memorandos/',
  },
  OFICIO: {
    id: 11,
    descricao: 'OFICIO',
    caminho: 'oficios/',
  },
  TOMBAMENTO: {
    id: 12,
    descricao: 'TOMBAMENTO',
    caminho: 'tombamentos/',
  },
  TERMO_DOACAO: {
    id: 13,
    descricao: 'TERMO_DOACAO',
    caminho: 'termos_doacao/',
  },
  RG: {
    id: 14,
    descricao: 'RG',
    caminho: 'rg/',
  },
  CPF: {
    id: 15,
    descricao: 'CPF',
    caminho: 'cpf/',
  },
  DECLARACAO_VACINACAO: {
    id: 16,
    descricao: 'DECLARACAO_VACINACAO',
    caminho: 'declaracao_vacinacao/',
  },
  COMPROVANTE_RESIDENCIA: {
    id: 17,
    descricao: 'COMPROVANTE_RESIDENCIA',
    caminho: 'comprovante_residencia/',
  },
  DOCUMENTO_DO_RESPONSAVEL: {
    id: 18,
    descricao: 'DOCUMENTO_DO_RESPONSAVEL',
    caminho: 'documento_do_responsavel/',
  },
  AUTODECLARACAO_RACIAL: {
    id: 19,
    descricao: 'AUTODECLARACAO_RACIAL',
    caminho: 'autodeclaracao_racial/',
  },
  TABELA_VENCIMENTO: {
    id: 20,
    descricao: 'TABELA_VENCIMENTO',
    caminho: 'tabela_vencimento/',
  },
} as const;

export type TipoDocumentoEnum = (typeof TipoDocumentoEnum)[keyof typeof TipoDocumentoEnum];
