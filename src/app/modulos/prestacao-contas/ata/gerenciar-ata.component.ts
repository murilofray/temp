import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtaService } from '../services/ata.service';
import { DocumentoService } from '../services/documento.service';
import { environment } from 'src/environments/environment';
import { Escola } from 'src/app/comum/model/escola';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';
import { Ata } from '../model/ata';
import { MessageService } from 'primeng/api';
import { NivelAcessoHandler } from '../services/nivel-acesso-handler.service';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-gerenciar-ata',
  templateUrl: './gerenciar-ata.component.html',
  styleUrls: ['./gerenciar-ata.component.scss'],
})
export class GerenciarAtaComponent implements OnInit {
  tipoOptions = [
    { label: 'Ata', value: 'ata' },
    { label: 'Convocação', value: 'convocacao' },
  ];

  modes = [
    { label: 'Fazer Upload', value: 'upload' },
    { label: 'Escrever Ata', value: 'editor' },
  ];
  selectedMode: string = 'upload'; // Valor inicial

  private caminhoArquivos = environment.docsApiURL;
  private anoFiscal: number;
  private escola: Escola;
  infoEscola: string = 'Sem escola ou ano selecionado';
  atas: any[] = [];
  filteredAtas: any[] = []; // Lista de atas filtradas para exibição
  displayedAtas: any[] = [];
  ataForm!: FormGroup;
  editAtaForm!: FormGroup;
  isAtaModalOpen = false;
  isEditModalOpen = false;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  maxDate: Date = new Date();
  selectedAta: any = null;
  existingFileName: string | null = null; // Propriedade para armazenar o nome do arquivo existente
  nivelAcessoId: number | null = null;
  NivelAcessoEnum = NivelAcessoEnum;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalAtas: number = 0;
  totalPages: number = 0;

  constructor(
    private fb: FormBuilder,
    private ataService: AtaService,
    private documentoService: DocumentoService,
    private messageService: MessageService,
    private nivelAcessoHandler: NivelAcessoHandler, // Adicione aqui
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.obterNivelAcesso();

    const dataEscola = localStorage.getItem('escola');

    this.anoFiscal = Number(localStorage.getItem('anoFiscal'));

    if (dataEscola && this.anoFiscal) {
      const dadoEscola = JSON.parse(dataEscola);
      this.escola = dadoEscola as Escola;
      // Talvez apresentar os dados da apm
      this.infoEscola = `${this.escola.nome} - ${this.anoFiscal}`;
      //   this.buscarTodas(this.escola.id, this.anoFiscal);
    } else {
      this.router.navigate(['/notfound']);
    }

    this.initForms();
    this.fetchAtas();
  }

  obterNivelAcesso(): void {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      this.nivelAcessoId = this.nivelAcessoHandler.extrairNivelAcessoId(tokenJWT);
      console.log('Nível de Acesso ID:', this.nivelAcessoId);
    } else {
      console.error('Token JWT não encontrado.');
    }
  }

  onModeChange(event: any): void {
    this.selectedMode = event.value;
  }

  onEditUpload(event: any): void {
    const file: File = event.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Arquivo selecionado para upload no modal de edição:', file.name);
    }
  }

  initForms(): void {
    this.ataForm = this.fb.group({
      titulo: ['', Validators.required],
      ata: [''], // Sem validação obrigatória aqui
      data: ['', Validators.required],
      modoAta: ['upload', Validators.required],
      tipoAta: ['', Validators.required],
    });

    // Validação condicional
    this.ataForm.get('modoAta')?.valueChanges.subscribe((modoAta) => {
      const ataControl = this.ataForm.get('ata');
      if (modoAta === 'editor') {
        ataControl?.setValidators(Validators.required); // Requerido apenas no modo "editor"
      } else {
        ataControl?.clearValidators(); // Remove validação
      }
      ataControl?.updateValueAndValidity(); // Atualiza a validação
    });

    this.editAtaForm = this.fb.group({
      id: [''], // ID para identificar qual ata está sendo editada
      titulo: ['', Validators.required],
      data: ['', Validators.required],
      ata: [''], // Sem validação obrigatória aqui
      modoAta: ['upload', Validators.required],
      tipoAta: ['ata', Validators.required],
    });

    // Validação condicional para o modo "editor"
    this.editAtaForm.get('modoAta')?.valueChanges.subscribe((modoAta) => {
      const ataControl = this.editAtaForm.get('ata');
      if (modoAta === 'editor') {
        ataControl?.setValidators(Validators.required); // Requerido apenas no modo "editor"
      } else {
        ataControl?.clearValidators(); // Remove validação
      }
      ataControl?.updateValueAndValidity(); // Atualiza a validação
    });
  }

  openEditModal(ata: any): void {
    this.selectedAta = ata;

    // Preenche o formulário com os valores existentes
    this.editAtaForm.patchValue({
      id: ata.id,
      titulo: ata.titulo,
      data: new Date(ata.data), // Converte a data para o formato Date
      ata: ata.ata,
    });

    // Define o nome do arquivo existente
    this.existingFileName = ata.DocumentosScan?.nomeArquivo || 'Nenhum arquivo disponível';

    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editAtaForm.reset();
    this.selectedAta = null;
    this.existingFileName = null; // Limpa o nome do arquivo
  }

  async updateAta(): Promise<void> {
    console.log('Início do método updateAta');

    if (this.editAtaForm.invalid) {
      console.error('Formulário inválido:', this.editAtaForm.errors);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    try {
      const id = this.editAtaForm.get('id')?.value || '';
      const titulo = this.editAtaForm.get('titulo')?.value || '';
      const data = this.editAtaForm.get('data')?.value || '';
      const modoAta = this.editAtaForm.get('modoAta')?.value;
      const tipoAta = this.editAtaForm.get('tipoAta')?.value;
      let ataContent = '';

      console.log('Valores do formulário:', { id, titulo, data, modoAta });

      let documentoScanId = this.selectedAta.documentosScanId; // ID atual do documento
      if (modoAta === 'upload' || modoAta === 'editor') {
        const documentoFormData = new FormData();
        documentoFormData.append('tipoDocumentoId', tde.ATA_ASSINADA.id.toString());
        documentoFormData.append('descricao', titulo);
        documentoFormData.append('caminho', 'atas');

        if (modoAta === 'upload' && this.selectedFile) {
          console.log('Adicionando arquivo para atualização do documento:', this.selectedFile.name);
          documentoFormData.append('pdf', this.selectedFile);
        } else if (modoAta === 'editor') {
          ataContent = this.editAtaForm.get('ata')?.value || '';
          if (!ataContent.trim()) {
            console.error('Erro: O conteúdo da ata está vazio.');
            throw new Error('Por favor, escreva o conteúdo da ata.');
          }

          console.log('Gerando PDF a partir do conteúdo do editor.');
          const pdfBlob = await this.generatePDFBlob(ataContent, tipoAta);
          documentoFormData.append('pdf', pdfBlob, 'AtaEditada.pdf');
        }

        // Atualiza o documento primeiro e obtém o novo ID
        const documentoResponse = await this.documentoService.update(documentoScanId, documentoFormData);
        if (!documentoResponse || !documentoResponse.id) {
          throw new Error('Erro ao atualizar o documento.');
        }

        console.log('Documento atualizado com sucesso:', documentoResponse);
        documentoScanId = documentoResponse.id; // Atualiza o ID do documento
      }

      // Atualizar os dados da ata
      const ataFormData = new FormData();
      ataFormData.append('id', id);
      ataFormData.append('titulo', titulo);
      ataFormData.append('data', data);
      ataFormData.append('ata', ataContent);
      ataFormData.append('tipo', tipoAta);
      ataFormData.append('documentosScanId', documentoScanId.toString());

      console.log('Atualizando a ata com os dados:', { id, titulo, data, documentoScanId });
      const resposta = await this.ataService.updateAta(id, ataFormData);
      console.log('Resposta do serviço de ata:', resposta);

      this.messageService.add({
        severity: 'success',
        summary: 'Ata atualizada',
        detail: 'Os dados da ata foram atualizados com sucesso.',
        life: 3000,
      });

      this.closeEditModal();
      this.fetchAtas();
    } catch (error) {
      console.error('Erro ao atualizar ata:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.message || 'Erro ao atualizar a ata.',
        life: 5000,
      });
    }
  }

  futureDateValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (selectedDate > today) {
      return { futureDate: true }; // Retorna erro se a data for maior que hoje
    }
    return null; // Sem erro
  }

  onUpload(event: any): void {
    const file: File = event.files[0];
    if (file) {
      this.selectedFile = file; // Atribui o arquivo à variável usada no `createAta`
      console.log('Arquivo selecionado para upload:', file.name);
    }
  }
  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.messageService.add({
        severity: 'success',
        summary: 'Arquivo realizado',
      });
    }
  }

  async fetchAtas() {
    try {
      this.atas = await this.ataService.getByEscola(this.escola.id, this.anoFiscal);
      this.filteredAtas = [...this.atas]; // Inicializa a lista filtrada com todas as atas
      this.totalAtas = this.atas.length;
      this.totalPages = Math.ceil(this.totalAtas / this.itemsPerPage);
      this.currentPage = 1;
      this.updateDisplayedAtas();
    } catch (error) {
      console.error('Erro ao carregar atas do banco de dados:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar as atas do banco de dados.',
        life: 5000,
      });
    }
  }

  filterAtas(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtra as atas pelo título
    this.filteredAtas = this.atas.filter((ata) => ata.titulo.toLowerCase().includes(query));

    // Atualiza a paginação
    this.updateDisplayedAtas();
  }

  updateDisplayedAtas(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedAtas = this.filteredAtas.slice(start, end); // Usa a lista filtrada
  }

  openAtaModal(): void {
    this.isAtaModalOpen = true;
  }

  closeAtaModal(): void {
    this.isAtaModalOpen = false;
    this.ataForm.reset();
    this.selectedFile = null;
  }

  async createAta(): Promise<void> {
    console.log('Início do método createAta');

    // Valida se o formulário é inválido
    if (this.ataForm.invalid) {
      console.log('Formulário inválido:', this.ataForm.errors);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    try {
      const titulo = this.ataForm.get('titulo')?.value || '';
      const data = this.ataForm.get('data')?.value || '';
      const modoAta = this.ataForm.get('modoAta')?.value;
      const tipoAta = this.ataForm.get('tipoAta')?.value;
      let ataContent = '';

      const formData = new FormData();

      // Adiciona os dados comuns ao FormData
      formData.append('titulo', titulo);
      formData.append('data', data);
      formData.append('tipoDocumentoId', tde.ATA_ASSINADA.id.toString());
      formData.append('caminho', tde.ATA_ASSINADA.caminho); // Caminho padrão

      // Verifica o modo de cadastro (upload ou editor)
      if (modoAta === 'upload') {
        ataContent = 'upload de arquivo';
        if (!this.selectedFile) {
          console.log('Erro: Nenhum arquivo selecionado para upload.');
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Por favor, selecione um arquivo para upload.',
            life: 3000,
          });
          return;
        }
        formData.append('pdf', this.selectedFile); // PDF carregado pelo usuário
      } else if (modoAta === 'editor') {
        ataContent = this.ataForm.get('ata')?.value || '';
        if (!ataContent) {
          console.log('Erro: O campo "Ata" está vazio.');
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Por favor, escreva o conteúdo da ata.',
            life: 3000,
          });
          return;
        }

        // Gera o PDF a partir do conteúdo do editor
        const pdfBlob = await this.generatePDFBlob(ataContent, tipoAta);
        formData.append('pdf', pdfBlob, 'AtaGerada.pdf'); // Adiciona o PDF gerado ao FormData
      }

      // Adiciona o conteúdo da ata ao FormData
      formData.append('ata', ataContent);

      console.log('Enviando dados do documento para o serviço de documento.');
      const documentoResponse = await this.documentoService.create(formData);
      console.log('Resposta do serviço de documento:', documentoResponse);

      const documentoScanId = documentoResponse.id;

      const ataFormData = new FormData();
      ataFormData.append('escolaId', this.escola.id.toString());
      ataFormData.append('documentosScanId', documentoScanId.toString());
      ataFormData.append('titulo', titulo);
      ataFormData.append('ata', ataContent);
      ataFormData.append('data', data);
      ataFormData.append('tipo', tipoAta);

      console.log('Enviando dados da ata para o serviço de ata.');
      const resposta = await this.ataService.create(ataFormData);
      console.log('Resposta do serviço de ata:', resposta);

      this.closeAtaModal();
      this.fetchAtas();
      this.errorMessage = null;

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Ata salva com sucesso.',
        life: 3000,
      });
    } catch (error) {
      console.error('Erro ao criar documento ou ata:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar a ata.',
        life: 5000,
      });
    }
  }

  async generatePDFBlob(content: string, tipoAta: string): Promise<Blob> {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Adiciona bordas ao documento
      doc.setLineWidth(1);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      // Adiciona o título
      const title = tipoAta === 'convocacao' ? 'EDITAL DE CONVOCAÇÃO' : 'ATA DE ASSEMBLEIA GERAL';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16); // Tamanho do título
      doc.text(title, pageWidth / 2, 50, { align: 'center' });

      // Define margens e altura inicial
      const margins = {
        top: 80,
        left: 40,
        right: 40,
      };
      let currentY = margins.top;
      const lineHeight = 14; // Espaçamento entre linhas

      // Configurações gerais para a fonte
      doc.setFont('helvetica', 'normal'); // Fonte padrão
      doc.setFontSize(12); // Fonte para o conteúdo

      // Função auxiliar para processar elementos HTML recursivamente
      const processElement = (element: any, currentFont: { font: string; style: string; size: number }) => {
        if (currentY > pageHeight - 40) {
          // Adiciona nova página se necessário
          doc.addPage();
          currentY = margins.top;
        }

        if (element.nodeType === 3) {
          // Texto simples
          const text = element.nodeValue.trim();
          if (text) {
            const lines = doc.splitTextToSize(text, pageWidth - margins.left - margins.right);
            lines.forEach((line) => {
              doc.setFont(currentFont.font, currentFont.style); // Aplica o estilo atual
              doc.setFontSize(currentFont.size); // Aplica o tamanho atual
              doc.text(line, margins.left, currentY);
              currentY += lineHeight;
            });
          }
        } else if (element.nodeName === 'P') {
          // Parágrafo
          element.childNodes.forEach((child) => processElement(child, currentFont));
          currentY += lineHeight; // Espaçamento extra para o parágrafo
        } else if (element.nodeName === 'BR') {
          // Quebra de linha
          currentY += lineHeight;
        } else if (element.nodeName === 'STRONG') {
          // Negrito
          const previousFont = { ...currentFont };
          currentFont.style = 'bold';
          element.childNodes.forEach((child) => processElement(child, currentFont));
          currentFont.style = previousFont.style; // Restaura estilo anterior
        } else if (element.nodeName === 'EM') {
          // Itálico
          const previousFont = { ...currentFont };
          currentFont.style = 'italic';
          element.childNodes.forEach((child) => processElement(child, currentFont));
          currentFont.style = previousFont.style; // Restaura estilo anterior
        } else if (element.nodeName === 'H1') {
          // Heading 1
          const previousFont = { ...currentFont };
          currentFont.style = 'bold';
          currentFont.size = 18; // Fonte maior para Heading
          element.childNodes.forEach((child) => processElement(child, currentFont));
          currentFont.size = previousFont.size; // Restaura tamanho da fonte anterior
          currentFont.style = previousFont.style;
          currentY += lineHeight; // Espaçamento adicional
        } else if (element.nodeName === 'H2') {
          // Subheading
          const previousFont = { ...currentFont };
          currentFont.style = 'bold';
          currentFont.size = 14; // Fonte intermediária para Subheading
          element.childNodes.forEach((child) => processElement(child, currentFont));
          currentFont.size = previousFont.size; // Restaura tamanho da fonte anterior
          currentFont.style = previousFont.style;
          currentY += lineHeight;
        } else {
          // Outros elementos (SPAN, DIV etc.)
          element.childNodes.forEach((child) => processElement(child, currentFont));
        }
      };

      // Processa o conteúdo HTML
      const parser = new DOMParser();
      const htmlContent = parser.parseFromString(content, 'text/html');
      const initialFont = { font: 'helvetica', style: 'normal', size: 12 };
      htmlContent.body.childNodes.forEach((child) => processElement(child, initialFont));

      // Retorna o PDF como Blob
      return doc.output('blob');
    } catch (error) {
      console.error('Erro ao gerar PDF com conteúdo formatado:', error);
      throw new Error('Falha ao gerar o PDF formatado.');
    }
  }

  verDocumento(ata: Ata): void {
    const caminho = ata.DocumentosScan.caminho;
    if (caminho) {
      const pdfUrl = `${this.caminhoArquivos}${caminho}`;
      window.open(pdfUrl, '_blank');
    } else {
      console.error('Caminho do documento não encontrado.');
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedAtas();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedAtas();
    }
  }

  async generatePDF(): Promise<void> {
    const ataContent = this.ataForm.get('ata')?.value;

    if (!ataContent) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Preencha o campo "Ata" antes de gerar o PDF.',
        life: 3000,
      });
      return;
    }

    // Cria um elemento temporário para renderizar o HTML do editor
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ataContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px'; // Esconde o div temporário fora da tela
    tempDiv.style.width = '800px'; // Define uma largura fixa para o conteúdo renderizado
    document.body.appendChild(tempDiv);

    // Captura o conteúdo renderizado como imagem
    const canvas = await html2canvas(tempDiv);
    document.body.removeChild(tempDiv); // Remove o elemento temporário após a captura

    const imgData = canvas.toDataURL('image/png');

    // Configurações do PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Calcula o tamanho da imagem no PDF
    const imgWidth = pageWidth - 20; // Margem de 10px em cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Garante que a altura da imagem não ultrapasse a página
    const finalHeight = imgHeight > pageHeight - 30 ? pageHeight - 30 : imgHeight;

    // Adiciona o título e a imagem ao PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Nova Ata', 10, 10);

    doc.addImage(imgData, 'PNG', 10, 20, imgWidth, finalHeight);

    // Salva o PDF
    doc.save('Ata.pdf');
  }

  async generatePDFForEdit(): Promise<void> {
    const ataContent = this.editAtaForm.get('ata')?.value;
    const ataTipo = this.editAtaForm.get('tipoAta')?.value;

    if (!ataContent) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Preencha o campo "Ata" antes de gerar o PDF.',
        life: 3000,
      });
      return;
    }

    // Gera o PDF com o conteúdo da ata
    const pdfBlob = await this.generatePDFBlob(ataContent, ataTipo);

    // Baixa o PDF
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AtaEditada.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  parseHtmlToTextSegments(html: string): { text: string; type: 'normal' | 'bold' | 'italic' }[] {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const segments: { text: string; type: 'normal' | 'bold' | 'italic' }[] = [];

    function parseNode(node: ChildNode, currentType: 'normal' | 'bold' | 'italic') {
      if (node.nodeType === Node.TEXT_NODE) {
        segments.push({ text: node.textContent || '', type: currentType });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        let newType = currentType;

        if (element.tagName === 'B' || element.tagName === 'STRONG') {
          newType = 'bold';
        } else if (element.tagName === 'I' || element.tagName === 'EM') {
          newType = 'italic';
        }

        element.childNodes.forEach((child) => parseNode(child, newType));
      }
    }

    tempDiv.childNodes.forEach((child) => parseNode(child, 'normal'));
    return segments;
  }
}
