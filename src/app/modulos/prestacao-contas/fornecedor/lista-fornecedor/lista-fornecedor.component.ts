import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../model/fornecedor';
import { Masker, Validator } from 'mask-validation-br';

@Component({
  selector: 'app-lista-fornecedor',
  templateUrl: './lista-fornecedor.component.html',
  styleUrl: './lista-fornecedor.component.scss',
})
export class ListaFornecedorComponent implements OnInit {
  constructor(
    private fornecedorService: FornecedorService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  submitted: boolean = false;
  isCNPJ: boolean = false;
  // // Para apresentação na tabela
  cols: any[] = [];
  listaFornecedores: any[] = [];
  fornecedoresFiltrados: any[] = [];
  fornecedorSelecionado: PesquisaPreco;
  tituloPesquisa: string;
  infoPesquisas = '';

  // // Para o CRUD de Fornecedores
  fornecedorDialog: boolean = false;
  deleteFornecedorDialog: boolean = false;
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  fornecedorDOC: string = '';
  crudFornecedor: Fornecedor = {
    id: undefined,
    cnpj: undefined,
    cpf: undefined,
    cidade: undefined,
    endereco: undefined,
    responsavel: undefined,
    nomeFantasia: undefined,
    telefone: undefined,
    email: undefined,
    razaoSocial: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    NotaFiscal: undefined,
    PropostaItem: undefined,
  };
  fornecedor: Fornecedor = {
    id: undefined,
    cnpj: '',
    cpf: '',
    cidade: '',
    endereco: '',
    responsavel: '',
    nomeFantasia: '',
    telefone: '',
    email: '',
    razaoSocial: '',
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    NotaFiscal: undefined,
    PropostaItem: undefined,
  };
  // Objeto Fornecedor que é transitado entre os estados da criação, update ou deletar
  private fornecedorOperador: Fornecedor = {
    id: undefined,
    cnpj: '',
    cpf: '',
    cidade: '',
    endereco: '',
    responsavel: '',
    nomeFantasia: '',
    telefone: '',
    email: '',
    razaoSocial: '',
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    NotaFiscal: undefined,
    PropostaItem: undefined,
  };

  /**
   * Inicializa o componente, buscando todos os Fornecedores e definindo as colunas da tabela.
   *
   * @remarks
   * A função `ngOnInit` é chamada automaticamente quando o componente é inicializado.
   * Ela chama a função `buscarTodos` para recuperar todos os Fornecedores do serviço de backend.
   * Em seguida, define as colunas da tabela usando o array `cols`.
   * Cada objeto no array `cols` representa uma coluna na tabela e contém as propriedades `field` e `header`.
   *
   */
  async ngOnInit() {
    this.buscarTodos();

    this.cols = [
      { field: 'razaoSocial', header: 'Razão Social' },
      { field: 'doc', header: 'CNPJ / CPF' },
      { field: 'fantasia', header: 'Nome Fantasia' },
      { field: 'endereco', header: 'Endereço' },
      { field: 'telefone', header: 'Telefone' },
      { field: 'email', header: 'Email' },
      { field: 'acoes', header: 'Ações' },
      { field: 'acoes', header: 'Ações' },
    ];
  }

  // FORNECEDORES E PROPOSTAS
  newFornecedor(pos: number) {
    this.resetForm();
    this.fornecedorDialog = true;
  }
  viewFornecedor(fornecedor: any) {
    console.log(fornecedor);

    this.isViewMode = true;
    this.crudFornecedor = { ...fornecedor };
    console.log(this.crudFornecedor);

    this.crudFornecedor.telefone = this.formatarTelefone(this.crudFornecedor.telefone);
    if (fornecedor.cpf) this.fornecedorDOC = this.crudFornecedor.cpf;
    else this.fornecedorDOC = this.crudFornecedor.cnpj;
    this.fornecedorDOC = this.FormatarCNPJorCPF(this.fornecedorDOC);
    this.fornecedorDialog = true;
  }
  alterFornecedor(fornecedor: any) {
    this.isViewMode = false;
    this.isEditMode = true;
    this.crudFornecedor = { ...fornecedor };
    if (fornecedor.cpf) this.fornecedorDOC = this.crudFornecedor.cpf;
    else this.fornecedorDOC = this.crudFornecedor.cnpj;
    this.fornecedorDOC = this.FormatarCNPJorCPF(this.fornecedorDOC);
    this.fornecedorDialog = true;
  }

  removeFornecedor(fornecedor: any) {
    this.resetForm();
    this.fornecedor = fornecedor as Fornecedor;
    this.deleteFornecedorDialog = true;
  }

  async confirmDeleteFornecedor() {
    try {
      const fornecedorRemovido = this.fornecedor;
      const resposta = await this.fornecedorService.delete(this.fornecedor);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Fornecedor ${fornecedorRemovido.razaoSocial} removido.`,
        life: 3000,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `${this.fornecedor.razaoSocial} está sendo utilizado nas Pesquisas de Preço`,
        life: 7000,
      });
      console.error('Erro ao deletear o fornecedor:', error);
    } finally {
      this.buscarTodos();
      this.resetForm();
    }
  }

  /**
   * Coleta e processa o documento do fornecedor (CNPJ ou CPF) para criar ou atualizar um fornecedor.
   *
   * @remarks
   * Esta função é responsável por validar o documento, preencher o objeto fornecedor,
   * e chamar o método createOrUpdateFornecedor para persistir os dados no banco de dados.
   */
  async coletarDadosFornecedors() {
    this.submitted = true;
    let hasError = false;

    this.fornecedor = this.crudFornecedor;

    // Valida o CNPJ ou CPF
    if (
      (!this.isViewMode && !this.validatorCnpjCpf(this.fornecedorDOC)) ||
      // (this.fornecedorDOC.length!= 11 && this.fornecedorDOC.length!= 14) ||
      !this.fornecedorDOC
    ) {
      this.mensagemErroCampo('CNPJ ou CPF');
      hasError = true;
    }

    // Valida Razão Social
    if (!this.isViewMode && !this.fornecedor.razaoSocial?.trim()) {
      this.mensagemErroCampo('Razão Social');
      hasError = true;
    }

    // Valida Nome Fantasia
    if (!this.isViewMode && !this.fornecedor.nomeFantasia?.trim()) {
      this.mensagemErroCampo('Nome Fantasia');
      hasError = true;
    }

    // Valida Cidade
    if (!this.isViewMode && !this.fornecedor.cidade?.trim()) {
      this.mensagemErroCampo('Cidade');
      hasError = true;
    }

    // Valida Endereço
    if (!this.isViewMode && !this.fornecedor.endereco?.trim()) {
      this.mensagemErroCampo('Endereço');
      hasError = true;
    }

    // Valida Responsável
    if (!this.isViewMode && !this.fornecedor.responsavel?.trim()) {
      this.mensagemErroCampo('Responsável');
      hasError = true;
    }

    // Valida Telefone
    if (!this.isViewMode && !this.removerMascaraTelefone(this.fornecedor.telefone).trim()) {
      this.mensagemErroCampo('Telefone');
      hasError = true;
    }

    // Valida Email
    if (!this.isViewMode && !this.fornecedor?.email.trim()) {
      this.mensagemErroCampo('Email');
      hasError = true;
    }

    if (hasError) return;

    // Adiciona o documento preenchido ao Fornecedor
    this.fornecedorDOC = this.removerMascaraCnpjCpf(this.fornecedorDOC.trim());
    if (this.fornecedorDOC.length == 14) {
      this.fornecedor.cnpj = this.fornecedorDOC;
      this.fornecedor.cpf = null;
    } else {
      this.fornecedor.cnpj = null;
      this.fornecedor.cpf = this.fornecedorDOC;
    }

    this.fornecedor.telefone = this.removerMascaraTelefone(this.fornecedor.telefone);
    this.fornecedorOperador = this.fornecedor;

    await this.createOrUpdateFornecedor();
    this.resetForm();
  }

  /**
   * Cria ou atualiza um fornecedor no banco de dados.
   *
   * @remarks
   * Esta função define a propriedade createdAt do fornecedorOperador caso ela ainda não esteja definida.
   * Em seguida, tenta criar ou atualizar o fornecedor no banco de dados usando o FornecedorService.
   *
   * @throws Lança um erro se houver um problema ao criar ou atualizar o fornecedor.
   */
  private async createOrUpdateFornecedor() {
    this.fornecedorOperador.createdAt = this.fornecedor.createdAt || new Date();

    try {
      const resposta = await this.fornecedorService.updateOrCreate(this.fornecedorOperador);
      this.fornecedorOperador = resposta.data as Fornecedor;
      this.buscarTodos();
      // Feche o diálogo e limpe os dados do formulário
      let detalhe = `Fornecedor ${this.fornecedorOperador.razaoSocial}, `;
      if (this.isEditMode) detalhe += 'editado.';
      else detalhe += 'adicionado a pesquisa.';

      // Apresenta mensagem de sucesso
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: detalhe,
        life: 1500,
      });
    } catch (error) {
      console.error('Erro ao cadastrar fornecedor', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao cadastrar fornecedor',
        detail: 'Ocorreu um erro ao tentar cadastrar o fornecedor.',
      });
    }
  }

  /**
   * Verifica se um determinado documento (CNPJ ou CPF) existe no banco de dados.
   * Se o documento for encontrado, ele atualiza as propriedades `fornecedor` e `fornecedorOperador`.
   * Se o documento não for encontrado, ele exibe uma mensagem de aviso.
   *
   * @remarks
   * Essa função é chamada quando o usuário insere um documento no campo `fornecedorDOC`.
   * Primeiro, ela verifica se o campo `fornecedorDOC` não está vazio e possui um comprimento válido (CNPJ ou CPF).
   * Se as condições forem atendidas, ela tenta buscar o Fornecedor correspondente no banco de dados.
   * Se o Fornecedor for encontrado, ele atualiza as propriedades `fornecedor` e `fornecedorOperador`.
   * Se o Fornecedor não for encontrado, ele exibe uma mensagem de aviso.
   */
  async verificarFornecedor() {
    // Verifica se o campo 'doc' (CNPJ ou CPF) está preenchido
    const documentoSemMascara = this.removerMascaraCnpjCpf(this.fornecedorDOC);
    if (
      (!this.isViewMode && !this.validatorCnpjCpf(documentoSemMascara)) ||
      (documentoSemMascara.length != 11 && documentoSemMascara.length != 14) ||
      !this.fornecedorDOC
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'CNPJ ou CPF inválido',
        detail: 'Por favor, informe um documento válido.',
      });
      return;
    }

    // Testa se há o documento cadastrado
    let fornecedorExistente;
    try {
      fornecedorExistente = await this.fornecedorService.getByDoc(documentoSemMascara);
      this.fornecedor = fornecedorExistente as Fornecedor;
      this.fornecedorOperador = this.fornecedorOperador;
    } catch (error) {
      console.error(error);

      this.messageService.add({
        severity: 'info',
        summary: 'Fornecedor não encontrado',
        detail: 'Por favor, continue o cadastro manualmente.',
      });
    } finally {
      if (this.isEditMode) {
        this.resetForm();
      }
    }
  }

  apresentarDOC(fornecedor: Fornecedor) {
    return this.FormatarCNPJorCPF(fornecedor.cnpj ? fornecedor.cnpj : fornecedor.cpf);
  }

  apresentarEndereco(fornecedor: Fornecedor) {
    return `${fornecedor.endereco}, ${fornecedor.cidade}`;
  }

  onRowSelect(event: any) {
    this.fornecedorSelecionado = event.data;
  }

  onRowUnselect(event: any) {
    this.fornecedorSelecionado = null;
  }
  /**
   * Recupera todos os Fornecedores do serviço de backend e atualiza os dados do componente.
   *
   * @remarks
   * Esta função utiliza o método `findAll` do `fornecedorService` para buscar todos os Fornecedores.
   * Se a solicitação for bem-sucedida, ele atualiza os arrays `listaFornecedores` e `fornecedoresFiltrados` com os dados recuperados.
   * Se ocorrer um erro durante a solicitação, ele registra o erro no console e exibe uma mensagem de erro usando o `MessageService`.
   */
  private async buscarTodos() {
    try {
      const resposta = await this.fornecedorService.findAll();
      this.listaFornecedores = resposta.data as any[];
      this.fornecedoresFiltrados = this.listaFornecedores;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível buscar os Fornecedores!',
      });
      console.error(`Erro aconteceu:\n ${error}`);
    }
  }

  hideDialog() {
    this.resetForm();
  }

  /**
   * Redefine todos os campos de formulário e variáveis relacionadas para seu estado inicial.
   *
   * @remarks
   * Essa função é usada para limpar todos os campos de formulário, caixas de diálogo e variáveis relacionadas
   * após uma interação do usuário ou ação. Ela define sinalizadores booleanos como falso, limpa
   * campos de formulário, e redefine objetos para seus valores padrão.
   */
  private resetForm() {
    this.submitted = false;
    this.fornecedorDialog = false;
    this.deleteFornecedorDialog = false;
    this.fornecedorSelecionado = null;
    this.isViewMode = false;
    this.isEditMode = false;
    this.fornecedorDOC = '';
    this.tituloPesquisa = '';
    this.resetFornecedores();
  }

  private resetFornecedores() {
    this.fornecedorOperador = {
      id: undefined,
      cnpj: undefined,
      cpf: undefined,
      cidade: undefined,
      endereco: undefined,
      responsavel: undefined,
      nomeFantasia: undefined,
      telefone: undefined,
      email: undefined,
      razaoSocial: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      NotaFiscal: undefined,
      PropostaItem: undefined,
    };
    this.fornecedor = {
      id: undefined,
      cnpj: undefined,
      cpf: undefined,
      cidade: undefined,
      endereco: undefined,
      responsavel: undefined,
      nomeFantasia: undefined,
      telefone: undefined,
      email: undefined,
      razaoSocial: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      NotaFiscal: undefined,
      PropostaItem: undefined,
    };
    this.crudFornecedor = {
      id: undefined,
      cnpj: undefined,
      cpf: undefined,
      cidade: undefined,
      endereco: undefined,
      responsavel: undefined,
      nomeFantasia: undefined,
      telefone: undefined,
      email: undefined,
      razaoSocial: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      NotaFiscal: undefined,
      PropostaItem: undefined,
    };
  }

  /**
   * Filtra a lista de Fornecedores com base na consulta do usuário.
   *
   * @param event - O evento de entrada que contém o valor de consulta do usuário.
   * @remarks
   * A função transforma a consulta do usuário em minúsculas e filtra a lista de Fornecedores,
   * incluindo qualquer Fornecedor que contenha a consulta em qualquer um dos seus atributos (CNPJ, CPF, email, endereço, telefone, cidade, razão social, nome fantasia).
   * Os resultados filtrados são armazenados no array `fornecedoresFiltrados`.
   */
  filterFornecedores(event: any) {
    const query = event.target.value.toLowerCase();
    this.fornecedoresFiltrados = this.listaFornecedores.filter(
      (fornecedor: Fornecedor) =>
        fornecedor.cnpj.toLocaleLowerCase().includes(query) ||
        fornecedor.cpf.toLocaleLowerCase().includes(query) ||
        fornecedor.email.toLocaleLowerCase().includes(query) ||
        fornecedor.endereco.toLocaleLowerCase().includes(query) ||
        fornecedor.telefone.toLocaleLowerCase().includes(query) ||
        fornecedor.cidade.toLocaleLowerCase().includes(query) ||
        fornecedor.razaoSocial.toLowerCase().includes(query) ||
        fornecedor.nomeFantasia.toLowerCase().includes(query),
    );
  }

  formatarTelefone(telefone: string): string {
    return Masker.phone(telefone);
  }

  private removerMascaraTelefone(telefone: string): string {
    return telefone.replace(/[\(\)\- ]/g, '');
  }

  private removerMascaraCnpjCpf(cnpjCpf: string): string {
    return cnpjCpf.replace(/[\.\-\/ ]/g, '');
  }

  private FormatarCNPJorCPF(doc: string): string {
    if (this.removerMascaraCnpjCpf(doc).length > 11) return Masker.cnpj(doc);
    else return Masker.cpf(doc);
  }

  private validatorCnpjCpf(cnpjCpf: string): boolean {
    if (this.removerMascaraCnpjCpf(cnpjCpf).length > 11) return Validator.cnpj(cnpjCpf);
    else return Validator.cpf(cnpjCpf);
  }

  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }

  updateMask() {
    this.fornecedorDOC = this.FormatarCNPJorCPF(this.fornecedorDOC);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
