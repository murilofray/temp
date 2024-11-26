import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MovimentacaoFinanceira } from '../../model/movimentacaoBancaria';
import { MovimentacaoFinanceiraService } from '../../services/movimentacao-financeira.service';
import { ContaBancaria } from '../../model/contaBancaria';
import { DocumentoService } from '../../services/documento.service';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { ContaBancariaService } from '../../services/conta-bancaria.service';
import { CreateDOCtoScanService } from '../../services/createDOCtoScan.service';
@Component({
  selector: 'app-listar-movimentacao',
  templateUrl: './listar-movimentacao.component.html',
  styleUrl: './listar-movimentacao.component.scss',
})
export class ListarMovimentacaoComponent implements OnInit {
  constructor(
    private movimentacaoFinanceiraService: MovimentacaoFinanceiraService,
    private contaBancariaService: ContaBancariaService,
    private documentoService: DocumentoService,
    private docServices: CreateDOCtoScanService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {}

  @ViewChild(PdfViewerComponent) pdfViewer!: PdfViewerComponent;

  async ngOnInit() {
    const dataContaBancaria = localStorage.getItem('contaBancaria');
    this.anoFiscal = Number(localStorage.getItem('anoFiscal'));

    if (dataContaBancaria && this.anoFiscal) {
      //   this.contaBancaria = await this.contaBancariaService.getById(Number(JSON.parse(dataContaBancaria).id));
      this.contaBancaria = JSON.parse(dataContaBancaria) as ContaBancaria;
      this.infoContaBancaria = `Agencia: ${this.contaBancaria.agencia} \t Conta nº ${this.contaBancaria.numeroConta}`;
      this.buscarTodas(this.contaBancaria.id, this.anoFiscal);
    } else {
      this.router.navigate(['/notfound']);
    }
  }

  // Variáveis
  // // Relativas aos Dropdown
  categoriasDropdown: { value: string; categoria: string }[] = [
    { value: 'Custeio', categoria: 'Custeio' },
    { value: 'Capital', categoria: 'Capital' },
  ];
  categoriaSelecionada: string;
  naturezasDropdown: { value: string; natureza: string }[] = [
    { value: 'E', natureza: 'Entrada' },
    { value: 'S', natureza: 'Saída' },
  ];
  naturezaSelecionada: string;
  // // Relativas a conta bancaria atual
  private contaBancaria: ContaBancaria;
  infoContaBancaria: string = 'Não há prestação de contas ou ano selecionado';

  // // Relativas as movimentações financeiras
  movimentacaoFinanceira: MovimentacaoFinanceira = {
    id: undefined,
    contaBancariaId: undefined,
    documentoScanId: undefined,
    data: undefined,
    valor: undefined,
    descricao: undefined,
    tipo: undefined,
    capitalCusteio: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    ContaBancaria: undefined,
    DocumentosScan: undefined,
  };
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  dialogMovFinanceira: boolean = false;
  dialogDeletarMovFinanceira: boolean = false;
  dialogDeletarArquivo: boolean = false;
  movimentacaoSelecionada: any;
  MovimentacoesFiltradas: any[] = [];
  listaMovimentacoes: any[] = []; // Esta deve ser a lista completa de movimentações

  submitted: boolean = false;
  private anoFiscal: number;
  private caminhoArquivos = environment.docsApiURL;
  uploadedFile: File | { tipoDocumentoId: number; caminho: string } | null = null;

  apresentarValor(movFinanceira: MovimentacaoFinanceira) {
    let saida;
    let entrada;
    if (movFinanceira.tipo === 'S') {
      saida = movFinanceira.valor;
      entrada = '';
    } else {
      saida = '';
      entrada = movFinanceira.valor;
    }
    return { saida, entrada };
  }

  // Métodos para manipular as Movimentações Financeiras
  // Método para cadastrar MOVIMENTAÇÃO FINANCEIRA
  createMovimentacao() {
    this.resetForm();
    this.dialogMovFinanceira = true;
  }

  editarMovimentacao(movimentacao: MovimentacaoFinanceira) {
    if (movimentacao) {
      this.movimentacaoFinanceira = { ...movimentacao };
      this.movimentacaoFinanceira.data = new Date(movimentacao.data);

      this.naturezaSelecionada = this.naturezasDropdown.find((n) => n.value === movimentacao.tipo).value;
      this.categoriaSelecionada = this.categoriasDropdown.find((c) => c.value === movimentacao.capitalCusteio).value;

      // Exibe o arquivo existente (se houver)
      if (movimentacao.documentoScanId) {
        this.uploadedFile = {
          tipoDocumentoId: movimentacao.DocumentosScan.tipoDocumentoId,
          caminho: `${this.caminhoArquivos}${movimentacao.DocumentosScan.caminho}`,
        };
      } else {
        this.uploadedFile = null;
      }

      this.isEditMode = true;
      this.dialogMovFinanceira = true;
    }
  }

  visualizarMovimentacao(movimentacao: MovimentacaoFinanceira | string) {
    let pdfUrl;
    if (typeof movimentacao === 'string') pdfUrl = `${movimentacao}`;
    else pdfUrl = `${this.caminhoArquivos}${movimentacao.DocumentosScan.caminho}`;
    this.pdfViewer.showPdf(pdfUrl);
  }

  async submitMovFinanceira() {
    this.submitted = true;
    let hasError = false;

    // Validação do campo Natureza da Movimentação
    if (!this.naturezaSelecionada) {
      this.mensagemErroCampo('uma Natureza');
      hasError = true;
    }
    // Validação do campo Categoria da Movimentação
    if (!this.categoriaSelecionada) {
      this.mensagemErroCampo('uma Categoria');
      hasError = true;
    }

    // Validação do campo descrição
    if (!this.movimentacaoFinanceira.descricao?.trim()) {
      this.mensagemErroCampo('uma descrição');
      hasError = true;
    }

    // Validação do campo data
    if (!this.movimentacaoFinanceira.data) {
      this.mensagemErroCampo('uma data');
      hasError = true;
    }

    // Validação do campo valor
    if (!this.movimentacaoFinanceira.valor || this.movimentacaoFinanceira.valor <= 0) {
      this.mensagemErroCampo('um valor');
      hasError = true;
    }

    // Validação do campo de upload
    if (!this.uploadedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campo inválido',
        detail: 'Anexe um arquivo.',
        life: 3000,
      });
      hasError = true;
    }

    // Se houver algum erro, interrompe o processo de cadastro
    if (hasError) {
      return;
    }
    this.movimentacaoFinanceira.tipo = this.naturezaSelecionada;
    this.movimentacaoFinanceira.capitalCusteio = this.categoriaSelecionada;
    this.movimentacaoFinanceira.contaBancariaId = this.contaBancaria.id;

    if (!this.isEditMode) await this.createMovimentacaoFinanceira();
    else await this.updateMovimentacaoFinanceira();

    this.buscarTodas(this.contaBancaria.id, this.anoFiscal);
    this.resetForm();
  }

  private async createMovimentacaoFinanceira() {
    // Registra o bem no banco de dados
    try {
      const respostaDOC = await this.docServices.createDOCandUpload(this.uploadedFile as File, tde.RECIBO);

      this.movimentacaoFinanceira.documentoScanId = respostaDOC.id;
      const resposta = await this.movimentacaoFinanceiraService.crete(this.movimentacaoFinanceira);
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao cadastrar',
        life: 1500,
      });
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Cadastrado',
      life: 1500,
      detail: `Movimentação financeira adicionada.`,
    });
  }

  private async updateMovimentacaoFinanceira() {
    if (!this.movimentacaoFinanceira.DocumentosScan) {
      const respostaDOC = await this.docServices.createDOCandUpload(this.uploadedFile as File, tde.RECIBO);
      this.movimentacaoFinanceira.documentoScanId = respostaDOC.id;
    }
    // Registra o bem no banco de dados
    try {
      const resposta = await this.movimentacaoFinanceiraService.update(this.movimentacaoFinanceira);
      this.messageService.add({
        severity: 'success',
        summary: 'Cadastrado',
        life: 1500,
        detail: `Movimentação financeira atualizada.`,
      });
    } catch (error) {
      console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro ao atualizar',
        life: 1500,
      });
      return;
    }
  }

  private async createDoc(): Promise<DocumentoScan> {
    const formData = new FormData();
    formData.append('caminho', tde.RECIBO.caminho);
    formData.append('tipoDocumentoId', tde.RECIBO.id.toString());
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

  //   ----------
  //   Método para deletar uma MOVIMENTAÇÃO FINANCEIRA
  deleteSelectedMovimentacao() {
    this.resetForm();
    this.dialogDeletarMovFinanceira = true;
  }

  confirmDelete() {
    this.dialogDeletarMovFinanceira = false;
    this.deleteMovFinanceira(this.movimentacaoSelecionada);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Movimentação financeira removida.`,
      life: 1500,
    });
    this.movimentacaoSelecionada = null;
    this.buscarTodas(this.contaBancaria.id, this.anoFiscal);
    this.resetForm();
  }

  private async deleteMovFinanceira(movFinanceira: MovimentacaoFinanceira) {
    try {
      const resposta = await this.movimentacaoFinanceiraService.delete(movFinanceira.id);
    } catch (error) {
      console.error(error);
    }
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
      accept: () => {
        this.removeUploadedFile();
      },
      reject: () => {
        // Nada a fazer aqui
      },
    });
  }

  // // ----------------------------------------------------------------

  /**
   * Recupera todas as movimentações relacionadas a uma conta bancária específica para um ano fiscal específico.
   * Se nenhum ano fiscal for fornecido, o ano atual é usado.
   *
   * @param idContaBancaria - O identificador único da conta bancária.
   * @param anoFiscal - (Opcional) O ano fiscal para o qual recuperar as movimentações.
   *                     Se não fornecido, o ano atual é usado.
   *
   * @throws Error - Se ocorrer um erro durante o processo de recuperação.
   */
  private async buscarTodas(idContaBancaria: number, anoFiscal?: number) {
    const ano = isNaN(anoFiscal) ? new Date().getFullYear() : anoFiscal;
    try {
      this.listaMovimentacoes = await this.movimentacaoFinanceiraService.getByContaBancaria(idContaBancaria, ano);
      this.MovimentacoesFiltradas = this.listaMovimentacoes;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível obter as Movimentações Financeiras',
      });
      console.error('BUSCAR TODAS:', error);
    }
  }

  hideDialog() {
    this.resetForm();
  }

  private resetForm() {
    // Dialogs
    this.dialogMovFinanceira = false;
    this.dialogDeletarMovFinanceira = false;
    this.dialogDeletarArquivo = false;

    //Valores
    this.isViewMode = false;
    this.isEditMode = false;
    this.submitted = false;
    this.naturezaSelecionada = undefined;
    this.categoriaSelecionada = undefined;

    // Objetos
    this.resetMovimentacaoFinanceira();
    this.uploadedFile = null;
  }

  private resetMovimentacaoFinanceira() {
    this.movimentacaoFinanceira = {
      id: undefined,
      contaBancariaId: undefined,
      documentoScanId: undefined,
      data: undefined,
      valor: undefined,
      descricao: undefined,
      tipo: undefined,
      capitalCusteio: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      ContaBancaria: undefined,
      DocumentosScan: undefined,
    };
  }

  /**
   * Filtra a lista de movimentações financeiras com base na entrada do usuário.
   *
   * @param event - O objeto de evento do campo de entrada.
   *                Deve conter uma propriedade 'target' com um 'value' que representa a consulta de pesquisa.
   *
   * @returns void - Esta função não retorna um valor, mas atualiza a propriedade `MovimentacoesFiltradas`
   *                 da classe com os resultados filtrados.
   *
   * A função realiza uma busca insensível a maiúsculas e minúsculas nos seguintes campos de cada objeto MovimentacaoFinanceira:
   * - descricao
   * - data (convertida para string ISO para pesquisa)
   * - valor (convertido para string para pesquisa)
   */
  filterMovimentacoes(event: any) {
    const query = event.target.value.toLowerCase();
    this.MovimentacoesFiltradas = this.listaMovimentacoes.filter(
      (movFinanceira: MovimentacaoFinanceira) =>
        movFinanceira.descricao.toLowerCase().includes(query) ||
        (typeof movFinanceira.data === 'string'
          ? new Date(movFinanceira.data).toISOString().includes(query)
          : movFinanceira.data.toISOString().includes(query)) ||
        movFinanceira.valor.toString().includes(query),
    );
  }
  onRowSelect(event: any) {
    this.movimentacaoSelecionada = event.data;
  }

  onRowUnselect(event: any) {
    this.movimentacaoSelecionada = null;
  }
  // Evento para ajustar o tamanho do diálogo ao abrir o calendário
  onCalendarShow() {
    const dialogElement = document.querySelector('p-dialog') as HTMLElement;
    if (dialogElement) {
      dialogElement.style.width = '700px'; // Ajuste de tamanho quando o calendário for aberto
    }
  }

  removeUploadedFile(): void {
    this.uploadedFile = null;
    this.movimentacaoFinanceira.documentoScanId = undefined;
    this.movimentacaoFinanceira.DocumentosScan = undefined;
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

  /**
   * Exibe uma mensagem de erro com o nome do campo especificado.
   *
   * @param campo - O nome do campo que causou o erro.
   *
   * Exibe uma mensagem usando o serviço de mensagens do PrimeNG, indicando que o usuário precisa fornecer um valor válido para o campo especificado.
   * A mensagem inclui o nome do campo e uma breve descrição do erro.
   */
  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }
}
