import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bem } from '../../model/bem';
import { BemService } from '../../services/bem.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Fornecedor } from '../../model/fornecedor';
import { PropostaBem } from '../../model/propostaBem';
import { FornecedorService } from '../../services/fornecedor.service';
import { Router } from '@angular/router';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { PrestacaoContas } from '../../model/prestacaoContas';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';

import { Validator, Masker } from 'mask-validation-br';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { DocumentoService } from '../../services/documento.service';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bem-pesquisa-preco',
  templateUrl: './bem-pesquisa-preco.component.html',
  styleUrl: './bem-pesquisa-preco.component.scss',
})
export class BemPesquisaPrecoComponent implements OnInit {
  @ViewChild('proponenteDocInput') proponenteDocInput!: ElementRef;
  @ViewChild(PdfViewerComponent) pdfViewer!: PdfViewerComponent;

  constructor(
    private bemService: BemService,
    private fornecedorService: FornecedorService,
    private pesquisaPrecoService: PesquisaPrecoService,
    private documentoService: DocumentoService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {}

  private prestacaoContas: PrestacaoContas;
  private pesquisaPreco: PesquisaPreco;
  private listaFornecedores: Fornecedor[] = [];
  private orcamentoProponente: string = undefined;
  private caminhoArquivos = environment.docsApiURL;
  uploadedFile: File | { tipoDocumentoId: number; caminho: string } | null = null;
  tituloPesquisa = 'Não há pesquisa selecionada';
  listaBens: any[] = [];
  bem: Bem = {
    id: undefined,
    pesquisaPrecoId: null,
    notaFiscalId: null,
    termoDoacaoId: null,
    descricao: '',
    menorValor: null,
    quantidade: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    PesquisaPreco: undefined,
    NotaFiscal: undefined,
    TermoDoacao: undefined,
    PropostaBem: undefined,
  };
  bemSelecionado: Bem;

  // Dialogs
  // // Bem
  bemDialog: boolean = false;
  editBemDialog: boolean = false;
  deleteBemDialog: boolean = false;
  deleteBensDialog: boolean = false;
  permitirConsolidar: boolean = false;
  dialogOrcamento: boolean = false;

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

  listaProponentes: Fornecedor[] = [];
  proponente: Fornecedor = {
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
  };
  private propostaBem: PropostaBem;

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
      const dadoPesquisa = JSON.parse(dataPesquisa);
      const pesquisa = await this.pesquisaPrecoService.getById(Number(dadoPesquisa.id));
      this.pesquisaPreco = pesquisa.data;
      this.tituloPesquisa = `${this.pesquisaPreco.titulo ? this.pesquisaPreco.titulo : ''}`;
      this.buscarTodos(this.pesquisaPreco.id);
    } else {
      console.log('Nenhum dado encontrado no LocalStorage');
      //   const pesquisa = await this.pesquisaPrecoService.getById(Number(1));
      //   this.pesquisaPreco = pesquisa.data;
      //   this.buscarTodos(this.pesquisaPreco.id);
      this.router.navigate(['/notfound']);
    }

    this.cols = [
      { field: 'bem', header: 'Bem' },
      { field: 'quantidade', header: 'Quantidade' },
      { field: 'proponenteA', header: 'Proponente A' },
      { field: 'proponenteB', header: 'Proponente B' },
      { field: 'proponenteC', header: 'Proponente C' },
    ];
  }

  addOrcamento(proponente: string) {
    this.resetForm();
    this.dialogOrcamento = true;
    this.orcamentoProponente = proponente;
  }
  async submitOrcamento() {
    if (!this.isEditMode) await this.createOrcamento();
    // else await this.updateMovimentacaoFinanceira();

    try {
      const resposta = await this.pesquisaPrecoService.update(this.pesquisaPreco);
    } catch (error) {
    } finally {
      this.buscarTodos(this.pesquisaPreco.id);
    }
  }
  private async createOrcamento() {
    const respostaDOC = await this.createDoc();
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
        console.warn('Proponente não reconhecido');
    }
  }

  private async createDoc(): Promise<DocumentoScan> {
    const formData = new FormData();
    formData.append('caminho', tde.ORCAMENTO.caminho);
    formData.append('tipoDocumentoId', tde.ORCAMENTO.id.toString());
    formData.append('pdf', this.uploadedFile as File);

    try {
      const respostaDOC = await this.documentoService.create(formData);
      return respostaDOC;
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao enviar Scan',
        life: 1500,
      });
      return null;
    }
  }

  valorProponente(bem: any, pos: number) {
    let existe: boolean = false;
    let valor: string = '';

    const fornecedor = this.listaProponentes[pos];
    const propostaBem =
      Array.isArray(bem.PropostaBem) && bem.PropostaBem.find((p: PropostaBem) => p.fornecedorId === fornecedor.id);

    if (propostaBem) {
      existe = true;
      valor = propostaBem.valor ? propostaBem.valor.toString() : '';
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
    const idBem = this.bem.id;
    const idFornecedor = this.fornecedorOperador.id;

    if (this.editValor) {
      const resposta = await this.bemService.updatePropostaBem({
        bemId: Number(idBem),
        fornecedorId: Number(idFornecedor),
        valor: this.valorProposto,
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Atualizado',
        life: 1500,
      });
    } else {
      const resposta = await this.bemService.createPropostaBem({
        bemId: Number(idBem),
        fornecedorId: Number(idFornecedor),
        valor: this.valorProposto,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Adicionado',
        life: 1500,
      });
    }
    this.buscarTodos(this.pesquisaPreco.id);
    this.resetForm();
  }

  novoValor(bem: any, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.bem = bem;
    this.editValor = false;
    this.valorDialog = true;
  }

  editarValor(bem: any, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.bem = bem;
    this.valorProposto = Number(this.valorProponente(bem, pos).valor);
    this.editValor = true;
    this.valorDialog = true;
  }

  removerValor(bem: any, pos: number) {
    this.resetForm();
    this.fornecedorOperador = this.listaProponentes[pos];
    this.valorProposto = 0;
    this.bem = bem;
    this.deleteValorDialog = true;
  }

  async confirmDeleteValor() {
    const idBem = this.bem.id;
    const idFornecedor = this.fornecedorOperador.id;
    try {
      const resposta = await this.bemService
        .deletePropostaBem({
          bemId: idBem,
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

  // Método para cadastrar BEM
  createBem() {
    this.resetForm();
    this.bemDialog = true;
  }

  /**
   * Registra um novo item no banco de dados relacionado à pesquisa atual.
   *
   * @param bem - O item a ser registrado.
   * @param bem.descricao - A descrição do item.
   * @param bem.quantidade - A quantidade do item.
   */
  async cadastrarBem() {
    this.submitted = true;

    if (this.bem.descricao?.trim()) {
      this.bem.pesquisaPrecoId = 1;

      // Registra o bem no banco de dados
      const resposta = await this.bemService.crete({
        pesquisaPrecoId: this.pesquisaPreco.id,
        descricao: this.bem.descricao,
        menorValor: 0,
        quantidade: this.bem.quantidade,
      });

      // Recupera o bem para a lista de bens
      this.buscarTodos(this.pesquisaPreco.id);

      // Exibe uma mensagem de sucesso
      this.messageService.add({
        severity: 'success',
        summary: 'Cadastrado',
        life: 1500,
        detail: `${this.bem.descricao} foi inserido na Pesquisa de Preço${this.tituloPesquisa}`,
      });
      // Limpa o formulário
      this.resetForm();
    }
  }

  //   ----------
  // Edição de um BEM
  editarSelectedBem() {
    if (this.bemSelecionado) {
      this.bem = { ...this.bemSelecionado };
      this.editBemDialog = true;
    }
  }

  // Método para atualizar o bem
  async atualizarBem() {
    this.submitted = true;
    if (this.bem.descricao?.trim()) {
      const resposta = await this.bemService.update(this.bem);

      this.messageService.add({
        severity: 'success',
        summary: 'Atualizado',
        life: 1500,
        detail: `${this.bem.descricao} foi atualizado na Pesquisa de Preço${this.tituloPesquisa}`,
      });

      this.buscarTodos(this.pesquisaPreco.id);
      this.resetForm();
    }
  }
  //   ----------

  //   Método para deletar um BEM
  deleteSelectedBem() {
    this.resetForm();
    this.deleteBemDialog = true;
  }

  confirmDelete() {
    const bemDeletado = this.bemSelecionado;
    this.deleteBensDialog = false;
    this.listaBens = this.listaBens.filter((val) => val.id !== this.bemSelecionado.id);
    this.deleteBem(this.bemSelecionado);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${bemDeletado.descricao} deletado.`,
      life: 3000,
    });
    this.bemSelecionado = null;
    this.buscarTodos(this.pesquisaPreco.id);
    this.resetForm();
  }

  private async deleteBem(bem: Bem) {
    try {
      const resposta = await this.bemService.delete(bem.id);
      let respostaProposta;
      for (let index = 0; index < 3; index++) {
        const element = bem.PropostaBem[index];
        if (element) {
          respostaProposta = await this.bemService.deletePropostaBem(element);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  //   ----------

  // FORNECEDORES E PROPOSTAS
  // // Visualizar um proponente
  viewProponente(proponente: any) {
    this.isViewMode = true;
    this.proponente = { ...proponente };
    this.proponente.telefone = this.formatarTelefone(this.proponente.telefone);
    if (proponente.cpf) this.proponenteDOC = this.proponente.cpf;
    else this.proponenteDOC = this.proponente.cnpj;
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
    this.proponenteDialog = true;
  }
  // // Editar um proponente
  editProponente(proponente: any) {
    this.isViewMode = false;
    this.isEditMode = true;
    this.proponente = { ...proponente };
    if (proponente.cpf) this.proponenteDOC = this.proponente.cpf;
    else this.proponenteDOC = this.proponente.cnpj;
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
    this.proponenteDialog = true;
  }

  // // Remover Proponente
  deleteProponente(proponente: any) {
    this.resetForm();
    this.proponente = proponente as Fornecedor;
    this.deleteProponenteDialog = true;
  }

  async confirmDeleteProponente() {
    try {
      this.removeProponente(this.pesquisaPreco, this.proponente.id);
      this.pesquisaPrecoService.update(this.pesquisaPreco);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Proponente ${this.proponente.nomeFantasia} removido.`,
        life: 3000,
      });
      this.deletarPropostasBemProponente(this.proponente.id);
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

  // Cadastrar um Proponente
  createProponente(pos: number) {
    this.resetForm();
    this.proponenteDialog = true;
    this.proponentePosicao = pos;
  }

  /**
   * Coleta e processa o documento do proponente (CNPJ ou CPF) para criar ou atualizar um proponente.
   *
   * @remarks
   * Esta função é responsável por validar o documento, preencher o objeto proponente,
   * e chamar o método createOrUpdateProponente para persistir os dados no banco de dados.
   */
  async coletarDadosProponentes() {
    // Verifica se o campo 'doc' (CNPJ ou CPF) está preenchido
    if (!this.proponenteDOC && !this.isViewMode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'CNPJ ou CPF inválido',
        detail: 'CNPJ ou CPF inválido. Informe um documento válido.',
      });
      return;
    }
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
   * Após a criação ou atualização bem-sucedida do fornecedor, ele atualiza a PesquisaPreco relacionada
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
      this.proponente = fornecedorExistente as Fornecedor;
      this.fornecedorOperador = this.fornecedorOperador;
    } catch (error) {
      if (error.status === 404)
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

  novoProponente(bem: Bem) {
    this.resetForm();
    this.proponenteDialog = true;
    this.bem = bem;
  }

  hideDialog() {
    this.resetForm();
  }

  /**
   * Recupera todos os bens e seus respectivos proponentes relacionados a uma pesquisa de preço específica.
   *
   * @param idPesquisa - O identificador único da pesquisa de preço.
   * @returns Uma promessa que resolve para um objeto contendo a lista de bens e seus proponentes.
   */
  private async buscarTodos(idPesquisa: number) {
    const resposta = await this.bemService.getByPesquisa(idPesquisa);
    this.listaBens = resposta.data;
    const respostaF = await this.fornecedorService.getByPesquisa(idPesquisa);
    this.listaFornecedores = respostaF['data'];
    this.todosValoresProponentesPreenchidos();
    this.construirListaProponentes();
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
  private construirListaProponentes() {
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
   * Verifica se todos os valores de proponentes para cada item na lista de bens estão preenchidos.
   *
   * @remarks
   * Essa função itera por cada item no vetor `listaBens`. Para cada item, ela verifica se o vetor `PropostaBem` é um vetor,
   * se seu comprimento é 3, e se todos os objetos `PropostaBem` possuem uma propriedade `valor` diferente de zero.
   * Se todas as condições são atendidas, ela define a propriedade `permitirConsolidar` como `true`. Caso contrário, ela a define como `false`.
   */
  private todosValoresProponentesPreenchidos() {
    const ok =
      this.listaBens.length > 0 &&
      this.listaBens.every((bem: Bem) => {
        return (
          Array.isArray(bem.PropostaBem) &&
          bem.PropostaBem.length === 3 &&
          bem.PropostaBem.every((p: PropostaBem) => p.valor != 0)
        );
      });

    if (ok) {
      this.permitirConsolidar = true;
    } else {
      this.permitirConsolidar = false;
    }
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
  private removeProponente(proponente: PesquisaPreco, remover: number) {
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
   * Exclui todos os itens de proposta relacionados a um determinado proponente da lista de Bens.
   *
   * @param proponenteId - O identificador exclusivo do proponente cujas propostas relacionadas precisam ser excluídas.
   *
   * @remarks
   * Essa função itera por cada Bem na matriz `listaBens`. Para cada Bem, ela verifica se a propriedade `PropostaBem`
   * é uma matriz e se cada item `PropostaBem` possui uma propriedade `fornecedorId` que corresponde ao `proponenteId` fornecido.
   * Se ambas as condições forem atendidas, ela chama o método `deletePropostaBem` do `bemService` para excluir a proposta.
   *
   * @throws Registra uma mensagem de erro no console se ocorrer um erro durante a exclusão das propostas.
   */
  private deletarPropostasBemProponente(proponenteId: number) {
    try {
      this.listaBens.forEach((bem: Bem) => {
        return (
          Array.isArray(bem.PropostaBem) &&
          bem.PropostaBem.every(async (p: PropostaBem) => {
            return await this.bemService.deletePropostaBem({
              bemId: bem.id,
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
    this.bemDialog = false;
    this.editBemDialog = false;
    this.deleteBemDialog = false;
    this.deleteBensDialog = false;
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
    this.dialogOrcamento = false;
    this.resetBem();
    this.resetProponente();
    this.resetFornecedor();
  }

  private resetBem() {
    this.bem = {
      id: undefined,
      pesquisaPrecoId: undefined,
      termoDoacaoId: undefined,
      descricao: undefined,
      menorValor: undefined,
      quantidade: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      PesquisaPreco: undefined,
      NotaFiscal: undefined,
      TermoDoacao: undefined,
      PropostaBem: undefined,
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
    };
  }

  navigateToConsolidar() {
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaPreco));
    this.router.navigate(['conta/consolidar/B']);
  }

  onRowSelect(event: any) {
    this.bemSelecionado = event.data; // Armazena o bem selecionado
  }

  onRowUnselect(event: any) {
    this.bemSelecionado = null; // Limpa a seleção quando o item é desmarcado
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

  updateMask() {
    this.proponenteDOC = this.FormatarCNPJorCPF(this.proponenteDOC);
  }

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  confirmarRemocao(proponente: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja remover o arquivo?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.removeUploadedFile(proponente);
      },
      reject: () => {
        // Nada a fazer aqui
      },
    });
  }

  removeUploadedFile(proponente: string): void {
    this.uploadedFile = null;

    switch (proponente) {
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

  onUpload(event: any) {
    const file = event.files[0];
    this.uploadedFile = file; // Salva o arquivo para envio posterior
    console.log(this.uploadedFile);
  }

  onFileSelected(event: any): void {
    const file: File = event.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.uploadedFile = file;
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

  viewOrcamento(proponente: string) {
    let docScan;

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
        console.warn('Proponente não reconhecido');
    }
    const pdfUrl = `${this.caminhoArquivos}${docScan.caminho}`;
    this.pdfViewer.showPdf(pdfUrl);
  }

  viewBotoesOrcamento(proponente: string) {
    switch (proponente) {
      case 'a':
        return this.pesquisaPreco.orcamentoA ? true : false;
      case 'b':
        return this.pesquisaPreco.orcamentoC ? true : false;
      case 'c':
        return this.pesquisaPreco.orcamentoC ? true : false;
      default:
        return false;
    }
  }
}
