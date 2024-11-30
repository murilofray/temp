import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../model/item';
import { ItemService } from '../../services/item.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Fornecedor } from '../../model/fornecedor';
import { PropostaItem } from '../../model/propostaItem';
import { FornecedorService } from '../../services/fornecedor.service';
import { Router } from '@angular/router';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';

import { Validator, Masker } from 'mask-validation-br';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { environment } from 'src/environments/environment';
import { CreateDOCtoScanService } from '../../services/createDOCtoScan.service';
import { NivelAcessoHandler } from '../../services/nivel-acesso-handler.service';
import { GerarPDFPlanilhaPreco } from '../../services/gerar-pdf-planilha-preco.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UnidadeEnum } from 'src/app/enums/UnidadeEnum';

@Component({
  selector: 'app-item-pesquisa-preco',
  templateUrl: './item-pesquisa-preco.component.html',
  styleUrl: './item-pesquisa-preco.component.scss',
})
export class ItemPesquisaPrecoComponent implements OnInit {
  @ViewChild('proponenteDocInput') proponenteDocInput!: ElementRef;
  @ViewChild(PdfViewerComponent) pdfViewer!: PdfViewerComponent;

  constructor(
    private itemService: ItemService,
    private fornecedorService: FornecedorService,
    private pesquisaPrecoService: PesquisaPrecoService,
    private createDOCtoScanService: CreateDOCtoScanService,
    private gerarPDFPlanilhaService: GerarPDFPlanilhaPreco,
    private niveisAcesso: NivelAcessoHandler,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {}

  isGestor: boolean = false;
  isApenasAPM: boolean = false;
  private pesquisaPreco: PesquisaPreco;
  private listaFornecedores: Fornecedor[] = [];
  private orcamentoProponente: string = undefined;
  private caminhoArquivos = environment.docsApiURL;
  uploadedFile: File | { tipoDocumentoId: number; caminho: string } | null = null;
  tituloPesquisa = 'Não há pesquisa selecionada';
  isPesquisaPrecoConsolidada: boolean;
  listaItens: any[] = [];
  item: Item = {
    id: undefined,
    pesquisaPrecoId: undefined,
    notaFiscalId: undefined,
    termoDoacaoId: undefined,
    descricao: '',
    menorValor: undefined,
    quantidade: undefined,
    unidade: undefined,
    justificativa: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    PesquisaPreco: undefined,
    NotaFiscal: undefined,
    TermoDoacao: undefined,
    PropostaItem: undefined,
  };
  itemSelecionado: Item;

  // Dialogs
  // // Item
  itemDialog: boolean = false;
  editItemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  deleteItensDialog: boolean = false;
  permitirConsolidar: boolean = false;
  pesquisaCompleta: boolean = false;
  dialogOrcamento: boolean = false;
  gerarPlanilha: boolean = false;

  // // Proponentes
  proponenteDialog: boolean = false;
  editProponenteDialog: boolean = false;
  deleteProponenteDialog: boolean = false;
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  proponenteDOC: string = '';
  private proponentePosicao: number;

  // // Valores
  valorDialog: boolean = false;
  valorProposto: number;
  deleteValorDialog = false;
  private editValor = false;
  labelValorItem = '';

  listaProponentes: Fornecedor[] = [];
  crudProponente: Fornecedor = {
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
  proponente: Fornecedor = {
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
  // Objeto Fornecedor que é transitado entre os estados da criação, update ou deletar
  private fornecedorOperador: Fornecedor = {
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

  unidadesDropdown = Object.values(UnidadeEnum).map((unid) => ({
    unidade: unid.nome,
    sigla: unid.sigla,
  }));
  submitted: boolean = false;
  cols: any[] = [];
  isCNPJ: boolean = false;

  /**
   * Inicializa o componente recuperando dados da Pesquisa de Preço do armazenamento local.
   * Se os dados forem encontrados, ele buscará os detalhes da Pesquisa de Preço do servidor.
   * Se nenhum dado for encontrado, ele redirecionará para a rota '/notfound'.
   *
   * @param dataPesquisa - Os dados da Pesquisa de Preço recuperados do armazenamento local.
   * @param dadoPesquisa - Os dados JSON analisados do armazenamento local.
   * @param pesquisa - Os dados da Pesquisa de Preço buscados do servidor.
   * @param router - O Angular Router para navegação.
   * @param pesquisaPrecoService - O serviço para buscar dados da Pesquisa de Preço.
   */
  async ngOnInit() {
    const dataPesquisa = localStorage.getItem('pesquisaPreco');
    if (dataPesquisa) {
      this.isGestor = this.niveisAcesso.isGestor();
      this.isApenasAPM = this.niveisAcesso.isApenasAPM();
      this.pesquisaPreco = await this.pesquisaPrecoService.getById(Number(JSON.parse(dataPesquisa).id));
      const nomePrograma = this.pesquisaPreco.Programa?.nome ? this.pesquisaPreco.Programa.nome : '';
      this.tituloPesquisa = `${nomePrograma}:  ${this.pesquisaPreco.titulo ? this.pesquisaPreco.titulo : ''}`;
      await this.buscarTodos(this.pesquisaPreco.id);
      this.verificarPesquisaPrecoConsolidada();
    } else {
      this.router.navigate(['/notfound']);
    }
  }

  valorProponente(item: any, pos: number) {
    let existe: boolean = false;
    let valor: string = '';

    const fornecedor = this.listaProponentes[pos];
    const propostaItem =
      Array.isArray(item.PropostaItem) && item.PropostaItem.find((p: PropostaItem) => p.fornecedorId === fornecedor.id);
    if (propostaItem) {
      existe = true;
      valor = propostaItem.valor ? propostaItem.valor.toString() : '';
    }
    return { existe, valor };
  }

  private verificarExisteFornecedor(pos: number) {
    // Verifique se a posição é válida e se a lista existe
    if (this.listaProponentes && this.listaProponentes.length > pos) {
      const fornecedor = this.listaProponentes[pos];
      const existe = fornecedor && fornecedor.id !== -1;
      return existe;
    } else {
      return false;
    }
  }

  /**
   * Recupera o nome, documento e o status de existência do proponente na posição fornecida.
   *
   * @param pos - A posição do proponente na lista.
   * @returns Um objeto contendo o nome, documento e o status de existência do proponente.
   * @returns {nome: string, doc: string, existe: boolean} - O nome, documento e o status de existência do proponente.
   */
  proponentesTopo(pos: number) {
    // Verifique se a posição é válida e se a lista existe
    const existe = this.verificarExisteFornecedor(pos);
    if (existe) {
      const fornecedor = this.listaProponentes[pos];
      const nome = fornecedor.razaoSocial || ''; // Nome padrão
      const doc = this.formatarDocumentoFornecedor(fornecedor);
      return { nome, doc, existe, fornecedor };
    } else {
      // Se a posição é inválida, retorne um objeto padrão
      return { nome: '', doc: '', existe: false };
    }
  }

  // Métodos para adicionar ou editar o valor de uma proposta
  async adicionarValor() {
    const idItem = this.item.id;
    const idFornecedor = this.fornecedorOperador.id;
    this.submitted = true;

    if (!this.valorProposto) {
      this.mensagemErroCampo('um valor');
      return;
    }

    if (this.editValor) {
      const resposta = await this.itemService.updatePropostaItem({
        itemId: Number(idItem),
        fornecedorId: Number(idFornecedor),
        valor: this.valorProposto,
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Atualizado',
        life: 2000,
      });
    } else {
      const resposta = await this.itemService.createPropostaItem({
        itemId: Number(idItem),
        fornecedorId: Number(idFornecedor),
        valor: this.valorProposto,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Adicionado',
        life: 2000,
      });
    }
    this.buscarTodos(this.pesquisaPreco.id);
    this.resetForm();
  }

  novoValor(item: Item, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.item = item;
    this.editValor = false;
    this.valorDialog = true;
    this.labelValorItem = this.item.descricao;
  }

  editarValor(item: any, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.item = item;
    this.valorProposto = Number(this.valorProponente(item, pos).valor);
    this.editValor = true;
    this.valorDialog = true;
  }

  removerValor(item: any, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.valorProposto = 0;
    this.item = item;
    this.deleteValorDialog = true;
  }

  async confirmDeleteValor() {
    const idItem = this.item.id;
    const idFornecedor = this.fornecedorOperador.id;
    try {
      const resposta = await this.itemService
        .deletePropostaItem({
          itemId: idItem,
          fornecedorId: idFornecedor,
        })
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Removido',
            life: 1500,
          });
          this.resetForm();
          this.buscarTodos(this.pesquisaPreco.id);
        });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao remover',
        life: 1000,
      });
    }
  }

  // Método para cadastrar ITEM
  newItem() {
    this.resetForm();
    this.itemDialog = true;
  }

  alterItem() {
    if (this.itemSelecionado) {
      this.item = { ...this.itemSelecionado };
      this.isEditMode = true;
      this.itemDialog = true;
    }
  }

  removeItem() {
    this.resetForm();
    this.deleteItemDialog = true;
  }

  private async createItem() {
    this.item.pesquisaPrecoId = this.pesquisaPreco.id;
    this.item.menorValor = 0;

    try {
      const resposta = await this.itemService.create(this.item);
      this.messageService.add({
        severity: 'success',
        summary: 'Adicionado',
        life: 3000,
        detail: `${this.item.descricao} foi adicionado à Pesquisa de Preço${this.tituloPesquisa}`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Erro ao adicionar: ${this.item.descricao}`,
        life: 7000,
      });
    }
  }

  private async updateItem() {
    try {
      const resposta = await this.itemService.update(this.item);
      this.messageService.add({
        severity: 'success',
        summary: 'Alterado',
        life: 3000,
        detail: `${this.item.descricao} foi alterado na Pesquisa de Preço${this.tituloPesquisa}`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: `Erro ao alterar: ${this.item.descricao}`,
        life: 7000,
      });
    }
  }

  /**
   * Registra um novo item no banco de dados relacionado à pesquisa atual.
   *
   * @param item - O item a ser registrado.
   * @param item.descricao - A descrição do item.
   * @param item.quantidade - A quantidade do item.
   */
  async submitedItem() {
    this.submitted = true;
    let hasError = false;

    // Validação do campo descrição
    if (!this.item.descricao?.trim()) {
      this.mensagemErroCampo('uma descrição');
      hasError = true;
    }

    // Validação do campo quantidade
    if (!this.item.quantidade || Number(this.item.quantidade) <= 0) {
      this.mensagemErroCampo('uma quantidade');
      hasError = true;
    }

    // Validação do campo unidade
    if (!this.item.unidade?.trim()) {
      this.mensagemErroCampo('uma unidade');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (!this.isEditMode) await this.createItem();
    else await this.updateItem();

    this.buscarTodos(this.pesquisaPreco.id);
    this.resetForm();
  }

  confirmDeleteItem() {
    const itemDeletado = this.itemSelecionado;
    this.deleteItensDialog = false;
    this.listaItens = this.listaItens.filter((val) => val.id !== this.itemSelecionado.id);
    this.deleteItem(this.itemSelecionado);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${itemDeletado.descricao} deletado.`,
      life: 3000,
    });
    this.itemSelecionado = null;
    this.buscarTodos(this.pesquisaPreco.id);
    this.resetForm();
  }

  private async deleteItem(item: Item) {
    try {
      const resposta = await this.itemService.delete(item.id);
      let respostaProposta;
      for (let index = 0; index < 3; index++) {
        const element = item.PropostaItem[index];
        if (element) {
          respostaProposta = await this.itemService.deletePropostaItem(element);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  //   ----------

  // FORNECEDORES E PROPOSTAS
  newProponente(pos: number) {
    this.resetForm();
    this.proponenteDialog = true;
    this.proponentePosicao = pos;
  }
  viewProponente(proponente: any) {
    this.isViewMode = true;
    this.crudProponente = { ...proponente };
    this.crudProponente.telefone = this.formatarTelefone(this.crudProponente.telefone);
    if (proponente.cpf) this.proponenteDOC = this.crudProponente.cpf;
    else this.proponenteDOC = this.crudProponente.cnpj;
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
    this.proponenteDialog = true;
  }
  alterProponente(proponente: any) {
    this.isViewMode = false;
    this.isEditMode = true;
    this.crudProponente = { ...proponente };
    if (proponente.cpf) this.proponenteDOC = this.crudProponente.cpf;
    else this.proponenteDOC = this.crudProponente.cnpj;
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
    this.proponenteDialog = true;
  }

  removeProponente(proponente: any) {
    this.resetForm();
    this.proponente = proponente as Fornecedor;
    this.deleteProponenteDialog = true;
  }

  async confirmDeleteProponente() {
    try {
      this.removeProponentePesquisaPreco(this.pesquisaPreco, this.proponente.id);
      this.pesquisaPrecoService.update(this.pesquisaPreco);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Proponente ${this.proponente.nomeFantasia} removido.`,
        life: 3000,
      });
      this.deletarPropostasItemProponente(this.proponente.id);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao remover proponente',
        detail: 'Ocorreu um erro ao tentar remover o proponente.',
      });
      console.error(error);
    } finally {
      this.buscarTodos(this.pesquisaPreco.id);
      this.resetForm();
    }
  }

  /**
   * Coleta e processa o documento do proponente (CNPJ ou CPF) para criar ou atualizar um proponente.
   *
   * @remarks
   * Esta função é responsável por validar o documento, preencher o objeto proponente,
   * e chamar o método createOrUpdateProponente para persistir os dados no banco de dados.
   */
  async coletarDadosProponentes() {
    this.submitted = true;
    let hasError = false;

    this.proponente = this.crudProponente;

    // Valida o CNPJ ou CPF
    if (
      (!this.isViewMode && !this.validatorCnpjCpf(this.proponenteDOC)) ||
      // (this.proponenteDOC.length!= 11 && this.proponenteDOC.length!= 14) ||
      !this.proponenteDOC
    ) {
      this.mensagemErroCampo('CNPJ ou CPF');
      hasError = true;
    }

    // Valida Razão Social
    if (!this.isViewMode && !this.proponente.razaoSocial?.trim()) {
      this.mensagemErroCampo('Razão Social');
      hasError = true;
    }

    // Valida Nome Fantasia
    if (!this.isViewMode && !this.proponente.nomeFantasia?.trim()) {
      this.mensagemErroCampo('Nome Fantasia');
      hasError = true;
    }

    // Valida Cidade
    if (!this.isViewMode && !this.proponente.cidade?.trim()) {
      this.mensagemErroCampo('Cidade');
      hasError = true;
    }

    // Valida Endereço
    if (!this.isViewMode && !this.proponente.endereco?.trim()) {
      this.mensagemErroCampo('Endereço');
      hasError = true;
    }

    // Valida Responsável
    if (!this.isViewMode && !this.proponente.responsavel?.trim()) {
      this.mensagemErroCampo('Responsável');
      hasError = true;
    }

    // Valida Telefone
    if (!this.isViewMode && !this.removerMascaraTelefone(this.proponente.telefone).trim()) {
      this.mensagemErroCampo('Telefone');
      hasError = true;
    }

    // Valida Email
    if (!this.isViewMode && !this.proponente?.email.trim()) {
      this.mensagemErroCampo('Email');
      hasError = true;
    }

    if (hasError) return;

    // Adiciona o documento preenchido ao Proponente
    this.proponenteDOC = this.removerMascaraCnpjCpf(this.proponenteDOC.trim());
    if (this.proponenteDOC.length == 14) {
      this.proponente.cnpj = this.proponenteDOC;
      this.proponente.cpf = null;
    } else {
      this.proponente.cnpj = null;
      this.proponente.cpf = this.proponenteDOC;
    }

    this.proponente.telefone = this.removerMascaraTelefone(this.proponente.telefone);
    this.fornecedorOperador = this.proponente;

    await this.createOrUpdateProponente();
    this.resetForm();
  }

  /**
   * Persistir no banco de dados as informações do proponente
   */
  /**
   * Cria ou atualiza um proponente no banco de dados e atualiza a PesquisaPreco relacionada.
   *
   * @remarks
   * Esta função define a propriedade createdAt do fornecedorOperador caso ela ainda não esteja definida.
   * Em seguida, tenta criar ou atualizar o fornecedor no banco de dados usando o FornecedorService.
   * Após a criação ou atualização item-sucedida do fornecedor, ele atualiza a PesquisaPreco relacionada
   * definindo a propriedade proponenteA, proponenteB ou proponenteC com base na proponentePosicao.
   *
   * @throws Lança um erro se houver um problema ao criar ou atualizar o fornecedor ou PesquisaPreco.
   */
  private async createOrUpdateProponente() {
    this.fornecedorOperador.createdAt = this.proponente.createdAt || new Date();

    try {
      const resposta = await this.fornecedorService.updateOrCreate(this.fornecedorOperador);
      this.fornecedorOperador = resposta.data as Fornecedor;
    } catch (error) {
      console.error(error);
    }

    // Após a criação ou atualização de um Fornecedor, atualize a PesquisaPreco para adicionar o novo proponente
    const propKey = `proponente${String.fromCharCode(65 + this.proponentePosicao)}`; // Gera 'proponenteA', 'proponenteB', ou 'proponenteC'
    if (this.pesquisaPreco.hasOwnProperty(propKey)) {
      this.pesquisaPreco[propKey] = this.fornecedorOperador.id;
    }

    try {
      const resposta = await this.pesquisaPrecoService.update(this.pesquisaPreco);

      // Atualize a lista de propostas
      this.buscarTodos(this.pesquisaPreco.id);

      // Feche o diálogo e limpe os dados do formulário
      let detalhe = `Proponente ${this.fornecedorOperador.razaoSocial}, `;
      if (this.isEditMode) detalhe += 'editado.';
      else detalhe += 'adicionado a pesquisa.';

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: detalhe,
        life: 1500,
      });
      this.hideDialog();
    } catch (error) {
      console.error('Erro ao cadastrar proponente', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao cadastrar proponente',
        detail: 'Ocorreu um erro ao tentar cadastrar o proponente.',
      });
    }
  }

  /**
   * Verifica se um determinado documento (CNPJ ou CPF) existe no banco de dados.
   * Se o documento for encontrado, ele atualiza as propriedades `proponente` e `fornecedorOperador`.
   * Se o documento não for encontrado, ele exibe uma mensagem de aviso.
   *
   * @remarks
   * Essa função é chamada quando o usuário insere um documento no campo `proponenteDOC`.
   * Primeiro, ela verifica se o campo `proponenteDOC` não está vazio e possui um comprimento válido (CNPJ ou CPF).
   * Se as condições forem atendidas, ela tenta buscar o Fornecedor correspondente no banco de dados.
   * Se o Fornecedor for encontrado, ele atualiza as propriedades `proponente` e `fornecedorOperador`.
   * Se o Fornecedor não for encontrado, ele exibe uma mensagem de aviso.
   */
  async verificarFornecedor() {
    // Verifica se o campo 'doc' (CNPJ ou CPF) está preenchido
    const documentoSemMascara = this.removerMascaraCnpjCpf(this.proponenteDOC);
    if (
      (!this.isViewMode && !this.validatorCnpjCpf(documentoSemMascara)) ||
      (documentoSemMascara.length != 11 && documentoSemMascara.length != 14) ||
      !this.proponenteDOC
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'CNPJ ou CPF inválido',
        detail: 'Por favor, informe um documento válido.',
      });
      return;
    }

    // Verificar se o novo fornecedor já está na pesquisa de preço
    const adicionado = this.listaProponentes.some((p: Fornecedor) => {
      return p && (p.cnpj === documentoSemMascara || p.cpf === documentoSemMascara);
    });

    if (!this.isViewMode && adicionado) {
      this.messageService.add({
        severity: 'info',
        summary: 'Fornecedor já cadastrado',
        detail: 'Este fornecedor já está cadastrado na pesquisa.',
      });
      return;
    }

    // Testa se há o documento cadastrado
    let fornecedorExistente;
    try {
      fornecedorExistente = await this.fornecedorService.getByDoc(documentoSemMascara);
      this.crudProponente = fornecedorExistente.data as Fornecedor;
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

  novoProponente(item: Item) {
    this.resetForm();
    this.proponenteDialog = true;
    this.item = item;
  }

  hideDialog() {
    this.resetForm();
  }

  /**
   * Recupera todos os itens e seus respectivos proponentes relacionados a uma pesquisa de preço específica.
   *
   * @param idPesquisa - O identificador único da pesquisa de preço.
   * @returns Uma promessa que resolve para um objeto contendo a lista de itens e seus proponentes.
   */
  private async buscarTodos(idPesquisa: number) {
    this.listaItens = await this.itemService.getByPesquisa(idPesquisa);
    this.listaFornecedores = await this.fornecedorService.getByPesquisa(idPesquisa);
    await this.construirListaProponentes();
    await this.todosValoresProponentesPreenchidos();
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaPreco as PesquisaPreco));
  }

  /**
   * Constrói a lista de proponentes relacionados à pesquisa de preço específica.
   *
   * @remarks
   * Essa função verifica se a lista de fornecedores e a pesquisa de preço estão definidas.
   * Se as condições forem atendidas, ela cria um array de IDs de proponentes,
   * preenche a lista de proponentes usando um map, e imprime a lista de proponentes.
   *
   * @throws Lança um erro se a lista de fornecedores ou a pesquisa de preço não estiverem definidas.
   */
  private async construirListaProponentes() {
    // Verifica se a lista de fornecedores e a pesquisa de preço estão definidas
    if (!this.listaFornecedores || !this.pesquisaPreco) {
      console.error('Lista de fornecedores ou pesquisa de preço não definida.');
      throw new Error('Lista de fornecedores ou pesquisa de preço não definida.');
    }

    // Cria um array de IDs de proponentes
    const proponentesIds = [
      this.pesquisaPreco.proponenteA,
      this.pesquisaPreco.proponenteB,
      this.pesquisaPreco.proponenteC,
    ];

    // Preenche a lista de proponentes usando map
    this.listaProponentes = proponentesIds.map((id) => this.listaFornecedores.find((f) => f.id === id));
  }

  /**
   * Verifica se todos os valores de proponentes para cada item na lista de itens estão preenchidos.
   *
   * @remarks
   * Essa função itera por cada item no vetor `listaItens`. Para cada item, ela verifica se o vetor `PropostaItem` é um vetor,
   * se seu comprimento é 3, e se todos os objetos `PropostaItem` possuem uma propriedade `valor` diferente de zero.
   * Se todas as condições são atendidas, ela define a propriedade `permitirConsolidar` como `true`. Caso contrário, ela a define como `false`.
   */
  private async todosValoresProponentesPreenchidos() {
    const okFornecedores = this.listaFornecedores.length === 3;
    const okProponentes =
      this.listaItens.length > 0 &&
      this.listaItens.every((item: Item) => {
        return (
          Array.isArray(item.PropostaItem) &&
          item.PropostaItem.length === 3 &&
          item.PropostaItem.every((p: PropostaItem) => p.valor != 0)
        );
      });

    if (okFornecedores && okProponentes && !this.pesquisaPreco.consolidado) {
      this.permitirConsolidar = true;
    } else if (this.pesquisaPreco.consolidado) {
      this.permitirConsolidar = false;
      this.pesquisaCompleta = true;
    } else {
      this.permitirConsolidar = false;
    }

    if (okProponentes) this.gerarPlanilha = true;
    else this.gerarPlanilha = false;
  }

  private verificarPesquisaPrecoConsolidada() {
    this.isPesquisaPrecoConsolidada = this.pesquisaPreco.consolidado;
  }

  /**
   * Remove um proponente de um objeto PesquisaPreco definindo o campo correspondente do proponente como nulo.
   *
   * @param proponente - O objeto PesquisaPreco do qual remover o proponente.
   * @param remover - O id do proponente a ser removido.
   *
   * @remarks
   * Esta função utiliza um mapa para determinar o campo correspondente do proponente no objeto PesquisaPreco.
   * Então, define o campo como nulo se o id do proponente corresponder ao id a ser removido.
   * Se nenhum campo correspondente do proponente for encontrado, ele registra uma mensagem de erro no console.
   */
  private removeProponentePesquisaPreco(proponente: PesquisaPreco, remover: number) {
    const map = {
      proponenteA: 'proponenteA',
      proponenteB: 'proponenteB',
      proponenteC: 'proponenteC',
    };
    const chave = Object.keys(map).find((chave) => proponente[chave] === remover);
    if (chave) {
      proponente[chave] = null;
    } else {
      console.error('Proponente externo não encontrado.');
    }
  }

  /**
   * Exclui todos os itens de proposta relacionados a um determinado proponente da lista de Itens.
   *
   * @param proponenteId - O identificador exclusivo do proponente cujas propostas relacionadas precisam ser excluídas.
   *
   * @remarks
   * Essa função itera por cada Item na matriz `listaItens`. Para cada Item, ela verifica se a propriedade `PropostaItem`
   * é uma matriz e se cada item `PropostaItem` possui uma propriedade `fornecedorId` que corresponde ao `proponenteId` fornecido.
   * Se ambas as condições forem atendidas, ela chama o método `deletePropostaItem` do `itemService` para excluir a proposta.
   *
   * @throws Registra uma mensagem de erro no console se ocorrer um erro durante a exclusão das propostas.
   */
  private deletarPropostasItemProponente(proponenteId: number) {
    try {
      this.listaItens.forEach((item: Item) => {
        return (
          Array.isArray(item.PropostaItem) &&
          item.PropostaItem.every(async (p: PropostaItem) => {
            return await this.itemService.deletePropostaItem({
              itemId: item.id,
              fornecedorId: proponenteId,
            });
          })
        );
      });
    } catch (error) {
      console.error('Erro ao excluir as propostas relacionadas ao proponente.', error);
    }
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
    this.itemDialog = false;
    this.editItemDialog = false;
    this.deleteItemDialog = false;
    this.deleteItensDialog = false;
    this.editProponenteDialog = false;
    this.deleteProponenteDialog = false;
    this.isViewMode = false;
    this.isEditMode = false;
    this.proponenteDialog = false;
    this.valorDialog = false;
    this.deleteValorDialog = false;
    this.valorProposto = null;
    this.editValor = false;
    this.proponenteDOC = '';
    this.labelValorItem = '';
    this.dialogOrcamento = false;
    this.resetItem();
    this.resetProponente();
    this.resetFornecedor();
  }

  private resetItem() {
    this.item = {
      id: undefined,
      pesquisaPrecoId: undefined,
      termoDoacaoId: undefined,
      descricao: undefined,
      menorValor: undefined,
      quantidade: undefined,
      unidade: undefined,
      justificativa: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      PesquisaPreco: undefined,
      NotaFiscal: undefined,
      TermoDoacao: undefined,
      PropostaItem: undefined,
    };
  }

  private resetProponente() {
    this.proponente = {
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
    this.crudProponente = {
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
  private resetFornecedor() {
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
  }

  navigateToConsolidar() {
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaPreco));
    this.router.navigate(['conta/consolidar']);
  }

  onRowSelect(event: any) {
    this.itemSelecionado = event.data; // Armazena o item selecionado
  }

  onRowUnselect(event: any) {
    this.itemSelecionado = null; // Limpa a seleção quando o item é desmarcado
  }

  /**
   * Recupera um documento formatado (CNPJ ou CPF) para um determinado Fornecedor.
   *
   * @param fornecedor - O objeto Fornecedor para o qual o documento precisa ser formatado.
   * @param fornecedor.cnpj - O CNPJ do Fornecedor.
   * @param fornecedor.cpf - O CPF do Fornecedor.
   *
   * @returns Uma string formatada representando o documento (CNPJ ou CPF) do Fornecedor.
   * Se o Fornecedor possuir um CNPJ, a função retornará uma string no formato "CNPJ: XXX.XXX.XXX/XXXX-XX".
   * Se o Fornecedor possuir um CPF, a função retornará uma string no formato "CPF: XXX.XXX.XXX-XX".
   * Se o Fornecedor não possuir um CNPJ ou CPF, a função retornará uma string vazia.
   */
  private formatarDocumentoFornecedor(fornecedor: Fornecedor): string {
    if (fornecedor.cnpj && fornecedor.cnpj.trim()) return `CNPJ: ${Masker.cnpj(fornecedor.cnpj)}`;
    else if (fornecedor.cpf && fornecedor.cpf.trim()) return `CPF: ${Masker.cpf(fornecedor.cpf)}`;
    else return '';
  }

  private formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
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
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
  }

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onUpload(event: any) {
    const file = event.files[0];
    this.uploadedFile = file; // Salva o arquivo para envio posterior
  }

  onFileSelected(event: any): void {
    const file: File = event.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.uploadedFile = file;
        this.messageService.add({
          severity: 'success',
          summary: 'Arquivo realizado',
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Formato inválido',
          detail: 'Apenas arquivos PDF são permitidos.',
        });
      }
    }
  }

  get isUploadedFileObject(): boolean {
    return this.uploadedFile && !(this.uploadedFile instanceof File);
  }

  getFileName(caminho: string) {
    return caminho.split('/').pop();
  }

  addOrcamento(proponente: string) {
    this.resetForm();
    this.dialogOrcamento = true;
    this.orcamentoProponente = proponente;
  }

  private async createOrcamento() {
    const respostaDOC = await this.createDOCtoScanService.createDOCandUpload(this.uploadedFile as File, tde.ORCAMENTO);
    switch (this.orcamentoProponente) {
      case 'a':
        this.pesquisaPreco.orcamentoA = respostaDOC.id;
        break;
      case 'b':
        this.pesquisaPreco.orcamentoB = respostaDOC.id;
        break;
      case 'c':
        this.pesquisaPreco.orcamentoC = respostaDOC.id;
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Proponente não reconhecido',
          detail: 'Não foi possível encontrar o orçamento do proponente.',
        });
        console.warn('Proponente não reconhecido');
    }
  }

  async submitOrcamento() {
    await this.createOrcamento();
    try {
      const resposta = await this.pesquisaPrecoService.update(this.pesquisaPreco);
      this.resetForm();
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao cadastrar',
        life: 1500,
      });
    } finally {
      this.buscarTodos(this.pesquisaPreco.id);
    }
  }

  viewOrcamento(proponente: string) {
    let docScan: DocumentoScan;
    switch (proponente) {
      case 'a':
        docScan = this.pesquisaPreco.DocumentoScanA;
        break;
      case 'b':
        docScan = this.pesquisaPreco.DocumentoScanB;
        break;
      case 'c':
        docScan = this.pesquisaPreco.DocumentoScanC;
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Proponente não reconhecido',
          detail: 'Não foi possível encontrar o orçamento do proponente.',
        });
        console.warn('Proponente não reconhecido');
    }
    const pdfUrl = `${this.caminhoArquivos}${docScan.caminho}`;
    this.pdfViewer.showPdf(pdfUrl);
  }

  viewBotoesOrcamento(proponente: string) {
    switch (proponente) {
      case 'a':
        return this.pesquisaPreco.orcamentoA === null ? false : true;
      case 'b':
        return this.pesquisaPreco.orcamentoB === null ? false : true;
      case 'c':
        return this.pesquisaPreco.orcamentoC === null ? false : true;
      default:
        return false;
    }
  }

  removeOrcamento(proponente: string) {
    this.orcamentoProponente = proponente;
    this.confirmarRemocao();
  }

  confirmarRemocao() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja remover o arquivo?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: async () => {
        this.removeUploadedFile();
        await this.pesquisaPrecoService.update(this.pesquisaPreco);
        this.buscarTodos(this.pesquisaPreco.id);
      },
      reject: () => {
        // Nada a fazer aqui
      },
    });
  }

  removeUploadedFile(): void {
    this.uploadedFile = null;

    switch (this.orcamentoProponente) {
      case 'a':
        this.pesquisaPreco.orcamentoA = null;
        break;
      case 'b':
        this.pesquisaPreco.orcamentoB = null;
        break;
      case 'c':
        this.pesquisaPreco.orcamentoC = null;
        break;
      default:
        console.warn('Proponente não reconhecido');
    }
  }

  gerarPlanilhaPesquisa() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
    const idEscola = decodedToken['escolaId'];
    this.gerarPDFPlanilhaService.salvarPDFPlanilhaPreco(this.pesquisaPreco, idEscola);
  }
}
