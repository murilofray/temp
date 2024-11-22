import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtaService } from '../services/ata.service';
import { DocumentoService } from '../services/documento.service';
import { GerirAtaService } from '../services/gerir-ata.service';
import { environment } from 'src/environments/environment';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';

@Component({
  selector: 'app-gerenciar-ata',
  templateUrl: './gerenciar-ata.component.html',
  styleUrls: ['./gerenciar-ata.component.scss'],
})
export class GerenciarAtaComponent implements OnInit {
  private caminhoArquivos = environment.docsApiURL; //Necessário verificar se o uso em produção irá funcionar
  atas: any[] = [];
  displayedAtas: any[] = [];
  processos: any[] = []; // Lista de processos para o select
  ataForm!: FormGroup;
  gerirAtaForm!: FormGroup;
  isAtaModalOpen = false;
  isGerirAtaModalOpen = false;
  selectedFile: File | null = null;

  errorMessage: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalAtas: number = 0;
  totalPages: number = 0;

  constructor(
    private fb: FormBuilder,
    private ataService: AtaService,
    private documentoService: DocumentoService,
    private gerirAtaService: GerirAtaService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.fetchAtas();
    this.loadProcessos(); // Carrega a lista de processos para o select
  }

  initForms(): void {
    this.ataForm = this.fb.group({
      titulo: ['', Validators.required],
      ata: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['', Validators.required],
      processo: ['', Validators.required], // Campo para o select de processos
    });

    this.gerirAtaForm = this.fb.group({
      titulo: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  fetchAtas(): void {
    this.ataService.getAtas().subscribe((data) => {
      this.atas = data.sort((a, b) => a.gerirAtaId - b.gerirAtaId);
      this.totalAtas = data.length;
      this.totalPages = Math.ceil(this.totalAtas / this.itemsPerPage);
      this.currentPage = 1;
      this.updateDisplayedAtas();
    });
  }

  updateDisplayedAtas(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedAtas = this.atas.slice(start, end);
  }

  loadProcessos(): void {
    this.gerirAtaService.getAll().subscribe(
      (processos) => {
        this.processos = processos;
      },
      (error) => console.error('Erro ao carregar processos:', error),
    );
  }

  openAtaModal(): void {
    this.isAtaModalOpen = true;
  }

  closeAtaModal(): void {
    this.isAtaModalOpen = false;
    this.ataForm.reset();
    this.selectedFile = null;
  }

  openGerirAtaModal(): void {
    this.isGerirAtaModalOpen = true;
  }

  closeGerirAtaModal(): void {
    this.isGerirAtaModalOpen = false;
    this.gerirAtaForm.reset();
  }

  onSubmitGerirAta(): void {
    if (this.gerirAtaForm.valid) {
      const gerirAtaData = {
        titulo: this.gerirAtaForm.get('titulo')?.value,
        apmId: 1,
      };

      this.gerirAtaService.create(gerirAtaData).subscribe(
        (response) => {
          this.closeGerirAtaModal();
          this.loadProcessos(); // Atualiza a lista de processos após criação
        },
        (error) => console.error('Erro ao criar GerirAta:', error),
      );
    }
  }

  createGerirAtaAndAta(): void {
    const gerirAtaId = this.ataForm.get('processo')?.value;

    if (this.ataForm.valid && this.selectedFile && gerirAtaId) {
      const formData = new FormData();
      formData.append('pdf', this.selectedFile);
      formData.append('tipoDocumentoId', tde.ATA_ASSINADA.id.toString());
      formData.append('caminho', tde.ATA_ASSINADA.caminho);

      this.documentoService.createDocumentoScan(formData).subscribe(
        (response) => {
          const documentoScanId = response.id;

          const ataFormData = new FormData();
          ataFormData.append('documentosScanId', documentoScanId.toString());
          ataFormData.append('titulo', this.ataForm.get('titulo')?.value || '');
          ataFormData.append('ata', this.ataForm.get('ata')?.value || '');
          ataFormData.append('data', this.ataForm.get('data')?.value || '');
          ataFormData.append('tipo', this.ataForm.get('tipo')?.value || '');
          ataFormData.append('gerirAtaId', gerirAtaId); // Inclua o ID do processo

          this.ataService.createAta(ataFormData).subscribe(
            () => {
              this.closeAtaModal();
              this.fetchAtas();
              this.errorMessage = null; // Limpa a mensagem de erro após sucesso
            },
            (error) => {
              if (error.status === 409) {
                this.errorMessage = error.error?.message || 'Erro já existe uma ata desse tipo nesse processo';
              } else {
                console.error('Erro ao criar ata:', error);
              }
            },
          );
        },
        (error) => console.error('Erro ao fazer upload do documento:', error),
      );
    } else {
      console.error('Formulário inválido ou arquivo/processo não selecionado');
    }
  }

  verDocumento(documentosScanId: number): void {
    this.documentoService.getDocumentoCaminho(documentosScanId).subscribe(
      (response) => {
        if (response.caminho) {
          const pdfUrl = `${this.caminhoArquivos}${response.caminho}`;
          window.open(pdfUrl, '_blank');
        } else {
          console.error('Caminho do documento não encontrado.');
        }
      },
      (error) => console.error('Erro ao carregar o documento:', error),
    );
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
