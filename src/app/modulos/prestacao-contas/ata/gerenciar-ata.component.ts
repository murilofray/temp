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
@Component({
  selector: 'app-gerenciar-ata',
  templateUrl: './gerenciar-ata.component.html',
  styleUrls: ['./gerenciar-ata.component.scss'],
})
export class GerenciarAtaComponent implements OnInit {
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

  initForms(): void {
    this.ataForm = this.fb.group({
      titulo: ['', Validators.required],
      ata: ['', Validators.required],
      data: ['', Validators.required],
    });

    this.editAtaForm = this.fb.group({
      id: [''], // ID para identificar qual ata está sendo editada
      titulo: ['', Validators.required],
      data: ['', Validators.required],
      ata: ['', Validators.required],
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

  async updateAta() {
    if (this.editAtaForm.valid) {
      const updatedAta = this.editAtaForm.value;
  
      try {
        // Atualizar o documento (se necessário)
        if (this.selectedFile) {
          const documentoFormData = new FormData();
          documentoFormData.append('tipoDocumentoId', tde.ATA_ASSINADA.id.toString()); // Tipo do documento
          documentoFormData.append('descricao', updatedAta.titulo); // Pode usar o título como descrição
          documentoFormData.append('caminho', tde.ATA_ASSINADA.caminho); // Caminho relativo
          documentoFormData.append('pdf', this.selectedFile); // Arquivo selecionado
  
          // Atualize o documento associado à ata
          const documentoId = this.selectedAta.documentosScanId; // ID do documento relacionado
          await this.documentoService.update(documentoId, documentoFormData);
  
          this.messageService.add({
            severity: 'success',
            summary: 'Arquivo atualizado',
            detail: 'O arquivo foi atualizado com sucesso.',
            life: 1500,
          });
        }
  
        // Atualizar os dados da ata
        const ataFormData = {
          id: updatedAta.id,
          titulo: updatedAta.titulo,
          data: updatedAta.data.toISOString(), // Converte a data para string ISO
          ata: updatedAta.ata,
        };
  
        await this.ataService.updateAta(updatedAta.id, ataFormData);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Ata atualizada',
          detail: 'Os dados da ata foram atualizados com sucesso.',
          life: 1500,
        });
  
        // Fechar o modal e recarregar as atas
        this.closeEditModal();
        this.fetchAtas();
      } catch (error) {
        console.error('Erro ao atualizar ata ou documento:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar a ata ou o arquivo.',
          life: 5000,
        });
      }
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
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

  createAta(): void {
    console.log('Formulário enviado');

    if (this.ataForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('titulo', this.ataForm.get('titulo')?.value || '');
      formData.append('ata', this.ataForm.get('ata')?.value || '');
      formData.append('data', this.ataForm.get('data')?.value || '');
      formData.append('tipoDocumentoId', tde.ATA_ASSINADA.id.toString()); // Valor fixo
      formData.append('caminho', tde.ATA_ASSINADA.caminho); // Valor fixo
      formData.append('pdf', this.selectedFile);

      this.documentoService.createDocumentoScan(formData).subscribe(
        async (response) => {
          const documentoScanId = response.id;

          const ataFormData = new FormData();
          ataFormData.append('escolaId', this.escola.id.toString());
          ataFormData.append('documentosScanId', documentoScanId.toString());
          ataFormData.append('titulo', this.ataForm.get('titulo')?.value || '');
          ataFormData.append('ata', this.ataForm.get('ata')?.value || '');
          ataFormData.append('data', this.ataForm.get('data')?.value || '');

          const resposta = await this.ataService.create(ataFormData);
          this.closeAtaModal();
          this.fetchAtas();
          this.errorMessage = null; // Limpa a mensagem de erro após sucesso
        },
        (error) => console.error('Erro ao fazer upload do documento:', error),
      );
    } else {
      console.error('Formulário inválido ou arquivo não selecionado');
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
}
