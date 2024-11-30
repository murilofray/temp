import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { OficioMemorandoService } from '../../services/oficio-memorando.service';
import { EscolaService } from 'src/app/comum/services/escola.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MovimentacaoFinanceira } from '../../model/movimentacaoBancaria';
import { DocumentoService } from '../../services/documento.service';
import { Escola } from 'src/app/comum/model/escola';
import { OficioMemorando } from '../../model/oficioMemorando';
import { DocumentoScan } from 'src/app/comum/model/documentoScan';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-om',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    TableModule,
    RadioButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    RippleModule,
    ToolbarModule,
    TooltipModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    FileUploadModule,
    PdfViewerComponent,
  ],
  templateUrl: './lista-ofimem.component.html',
  styleUrl: './lista-ofimem.component.scss',
})
export class ListaOfiMemComponent implements OnInit {
  constructor(
    private oficioMemorandoService: OficioMemorandoService,
    private escolaService: EscolaService,
    private documentoService: DocumentoService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {}

  @ViewChild(PdfViewerComponent) pdfViewer!: PdfViewerComponent;

  async ngOnInit() {
    const dataEscola = localStorage.getItem('escola');
    this.anoFiscal = Number(localStorage.getItem('anoFiscal'));
    if (dataEscola && this.anoFiscal) {
      const dadoEscola = JSON.parse(dataEscola);
      this.escola = dadoEscola as Escola;
      this.buscarTodos(this.escola.id, this.anoFiscal);
      this.infoEscola = `${this.escola.nome} - ${this.anoFiscal}`;
    } else {
      this.router.navigate(['/notfound']);
    }
  }

  // Variáveis
  // // Relativas a conta bancaria atual
  private escola: Escola;
  infoEscola: string = 'Sem escola ou ano selecionado';

  // // Relativas as movimentações financeiras
  oficioMemorando: OficioMemorando = {
    id: undefined,
    escolaId: undefined,
    documentoScanId: undefined,
    titulo: undefined,
    tipo: undefined,
    data: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    Escola: undefined,
    DocumentosScan: undefined,
  };
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  dialogOfiMem: boolean = false;
  dialogDeletarOfiMem: boolean = false;
  dialogDeletarArquivo: boolean = false;
  ofiMemSelecionada: any;
  ofiMemFiltradas: any[] = [];
  listaOfiMem: any[] = []; // Esta deve ser a lista completa de movimentações

  submitted: boolean = false;
  private anoFiscal: number;
  private caminhoArquivos = environment.docsApiURL;
  uploadedFile: File | { tipoDocumentoId: number; caminho: string } | null = null;

  // Métodos para manipular as Movimentações Financeiras
  // Método para cadastrar MOVIMENTAÇÃO FINANCEIRA
  newOficioMemorando() {
    this.resetForm();
    this.dialogOfiMem = true;
  }

  editarOficioMemorando(oficioMemorando: OficioMemorando) {
    if (oficioMemorando) {
      this.oficioMemorando = { ...oficioMemorando };
      this.oficioMemorando.data = new Date(oficioMemorando.data);
      if (oficioMemorando.documentoScanId) {
        this.uploadedFile = {
          tipoDocumentoId: oficioMemorando.DocumentosScan.tipoDocumentoId,
          caminho: `${this.caminhoArquivos}${oficioMemorando.DocumentosScan.caminho}`,
        };
      } else {
        this.uploadedFile = null;
      }
      this.isEditMode = true;
      this.dialogOfiMem = true;
    }
  }

  visualizarOficioMemorando(movimentacao: MovimentacaoFinanceira | string) {
    let pdfUrl;
    if (typeof movimentacao === 'string') pdfUrl = `${movimentacao}`;
    else pdfUrl = `${this.caminhoArquivos}${movimentacao.DocumentosScan.caminho}`;
    this.pdfViewer.showPdf(pdfUrl);
  }

  async submitOficioMemorando() {
    console.log(this.oficioMemorando);

    this.submitted = true;
    let hasError = false;

    // Validação do campo tipo
    if (!this.oficioMemorando.tipo) {
      this.mensagemErroCampo('um tipo');
      hasError = true;
    }

    // Validação do campo descrição
    if (!this.oficioMemorando.titulo?.trim()) {
      this.mensagemErroCampo('uma descrição');
      hasError = true;
    }

    // Validação do campo data
    if (!this.oficioMemorando.data) {
      this.mensagemErroCampo('uma data');
      hasError = true;
    }

    // Se houver algum erro, interrompe o processo de cadastro
    if (hasError) {
      return;
    }

    this.oficioMemorando.escolaId = this.escola.id;
    if (!this.isEditMode) await this.createOficioMemorando();
    else await this.updateOficioMemorando();

    this.buscarTodos(this.escola.id, this.anoFiscal);
    this.resetForm();
  }

  private async createOficioMemorando() {
    try {
      const respostaDOC = await this.createDoc();
      this.oficioMemorando.documentoScanId = respostaDOC.id;
      const resposta = await this.oficioMemorandoService.crete(this.oficioMemorando);
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
      detail: `${this.oficioMemorando.tipo} adicionado.`,
    });
  }

  private async updateOficioMemorando() {
    console.log('Entrou na edição');
    console.log(this.oficioMemorando);

    if (!this.oficioMemorando.DocumentosScan) {
      const respostaDOC = await this.createDoc();
      this.oficioMemorando.documentoScanId = respostaDOC.id;
    }
    // Registra o bem no banco de dados
    try {
      const resposta = await this.oficioMemorandoService.update(this.oficioMemorando);
      this.messageService.add({
        severity: 'success',
        summary: 'Cadastrado',
        life: 1500,
        detail: `${this.oficioMemorando.tipo} adicionado.`,
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
  deleteSelectedOfiMem() {
    this.resetForm();
    this.dialogDeletarOfiMem = true;
  }

  confirmDelete() {
    this.dialogDeletarOfiMem = false;
    this.deleteMovFinanceira(this.ofiMemSelecionada);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Ofício/Memorando removida.`,
      life: 1500,
    });
    this.ofiMemSelecionada = null;
    this.buscarTodos(this.escola.id, this.anoFiscal);
    this.resetForm();
  }

  private async deleteMovFinanceira(movFinanceira: MovimentacaoFinanceira) {
    try {
      const resposta = await this.oficioMemorandoService.delete(movFinanceira.id);
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
   * Recupera todos os documentos relacionadas a uma escola específica para um ano fiscal específico.
   * Se nenhum ano fiscal for fornecido, o ano atual é usado.
   *
   * @param idEscola - O identificador único da escola.
   * @param anoFiscal - (Opcional) O ano fiscal para o qual recuperar os documentos.
   *                     Se não fornecido, o ano atual é usado.
   *
   * @throws Error - Se ocorrer um erro durante o processo de recuperação.
   */
  private async buscarTodos(idEscola: number, anoFiscal?: number) {
    const ano = isNaN(anoFiscal) ? new Date().getFullYear() : anoFiscal;
    try {
      const resposta = await this.oficioMemorandoService.getByEscola(idEscola, ano);
      this.listaOfiMem = resposta;
      this.ofiMemFiltradas = this.listaOfiMem;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Não foi possível obter os Oficios e Memorandos',
        detail: `${error.response.data.message}`,
      });
      console.error('BUSCAR TODAS:', error);
    }
  }

  hideDialog() {
    this.resetForm();
  }

  private resetForm() {
    // Dialogs
    this.dialogOfiMem = false;
    this.dialogDeletarOfiMem = false;
    this.dialogDeletarArquivo = false;

    //Valores
    this.isViewMode = false;
    this.isEditMode = false;
    this.submitted = false;

    // Objetos
    this.resetMovimentacaoFinanceira();
  }

  private resetMovimentacaoFinanceira() {
    this.oficioMemorando = {
      id: undefined,
      escolaId: undefined,
      documentoScanId: undefined,
      titulo: undefined,
      tipo: undefined,
      data: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      Escola: undefined,
      DocumentosScan: undefined,
    };
  }

  /**
   * Filtra a lista de objetos OficioMemorando com base em uma consulta de pesquisa.
   *
   * @param event - O objeto de evento que contém a consulta de pesquisa.
   *                A consulta é obtida da propriedade 'value' do objeto 'target'.
   *
   * @remarks A função filtra a lista de objetos OficioMemorando com base nas propriedades 'titulo' e 'data'.
   *          A consulta de pesquisa é convertida para minúsculas para uma comparação sem distinção de maiúsculas e minúsculas.
   *          A função utiliza o método 'filter' para criar um novo array de objetos filtrados.
   *          Os objetos filtrados são armazenados na propriedade 'ofiMemFiltradas'.
   */
  filterOfiMem(event: any) {
    const query = event.target.value.toLowerCase();
    this.ofiMemFiltradas = this.listaOfiMem.filter(
      (ofiMem: OficioMemorando) =>
        ofiMem.titulo.toLocaleLowerCase().includes(query) ||
        ofiMem.titulo.toLowerCase().includes(query) ||
        (typeof ofiMem.data === 'string'
          ? new Date(ofiMem.data).toISOString().includes(query)
          : ofiMem.data.toISOString().includes(query)),
    );
  }

  onRowSelect(event: any) {
    this.ofiMemSelecionada = event.data;
  }

  onRowUnselect(event: any) {
    this.ofiMemSelecionada = null;
  }
  // Evento para ajustar o tamanho do diálogo ao abrir o calendário
  onCalendarShow() {
    const dialogElement = document.querySelector('p-dialog') as HTMLElement;
    if (dialogElement) {
      dialogElement.style.height = '700px'; // Ajuste de tamanho quando o calendário for aberto
    }
  }

  removeUploadedFile(): void {
    this.uploadedFile = null;
    this.oficioMemorando.documentoScanId = undefined;
    this.oficioMemorando.DocumentosScan = undefined;
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

  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }
}
