import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TituloService } from '../services/titulo.service';
import { ServidorService } from '../../../comum/services/servidor.service';
import { DocumentoService } from '../services/documento.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { CategoriaCertificadoService } from '../services/categoria-certificado.service';
export interface JwtPayload {
  servidor: {
    id: number;
    escolaId: number;
    nome: string;
    NivelAcessoServidor: any[];
  };
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-lancar-titulos',
  templateUrl: './lancar-titulos.component.html',
  styleUrls: ['./lancar-titulos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TableModule,
  ],
})

export class LancarTitulosComponent implements OnInit {
  titulos: any[] = [];
  filteredTitulos: any[] = [];
  servidores: any[] = [];
  categoriasCertificado: any[] = [];
  documentoScanId: number | null = null;
  tituloForm!: FormGroup;
  isModalOpen = false;
  selectedFile: File | null = null;

  errorMessage: string | null = null;
  servidorId: number | null = null;
  servidorNome: string = '';
  nivelAcessoServidor: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private servidorService: ServidorService,
    private documentoService: DocumentoService,
    private categoriaCertificadoService: CategoriaCertificadoService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadServidores();
    this.loadTitulos();
    this.loadCategoriasCertificado();
    this.getServidorFromToken();
  }

  getServidorFromToken(): void {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      this.servidorId = decodedToken.servidor.id;
      this.servidorNome = decodedToken.servidor.nome;
      this.nivelAcessoServidor = decodedToken.servidor.NivelAcessoServidor;

      // Atualiza o formulário com o ID do servidor
      this.tituloForm.patchValue({ servidorId: this.servidorId });
    }
  }

  initForms(): void {
    this.tituloForm = this.fb.group({
      servidorId: [this.servidorId],
      documentoScanId: [''],
      nome: ['', Validators.required],
      instituicao: ['', Validators.required],
      tipoId: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
      pontos: [{ value: 0, disabled: true }], // Garantir que o valor inicial seja número
      dataConclusao: ['', Validators.required],
      validade: [''],
      aprovadoPor: [''],
    });

    this.tituloForm.get('tipoId')?.valueChanges.subscribe((tipoId) => {
      const cargaHoraria = this.tituloForm.get('cargaHoraria')?.value || 0;
      const categoria = this.categoriasCertificado.find(cat => cat.id === tipoId);
      const pontosCalculados = categoria ? parseFloat((categoria.pontosPorHora * cargaHoraria).toFixed(2)) : 0;
      this.tituloForm.get('pontos')?.setValue(pontosCalculados);
    });
  }

  loadServidores(): void {
    this.servidorService.getAll().subscribe(
      (data) => (this.servidores = data),
      (error) => console.error('Erro ao carregar servidores:', error),
    );
  }

  loadTitulos(): void {
    this.tituloService.getAll().subscribe(
      (data) => {
        this.titulos = data;
        this.filteredTitulos = data;
      },
      (error) => console.error('Erro ao carregar títulos:', error),
    );
  }

  loadCategoriasCertificado(): void {
    this.categoriaCertificadoService.listarCategorias().then(
      (response) => (this.categoriasCertificado = response.data)
    ).catch((error) => console.error('Erro ao carregar categorias de certificado:', error));
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.tituloForm.reset();
    this.selectedFile = null;
  }

  createTitulo(): void {
    if (this.tituloForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('tipoDocumentoId', '1');
      formData.append('pdf', this.selectedFile);

      this.documentoService.createDocumentoScan(formData).subscribe(
        (response) => {
          const documentoScanId = response.id;
          const tituloData = {
            ...this.tituloForm.value,
            pontos: parseFloat(this.tituloForm.get('pontos')?.value), // Certificar que o valor é Float
            documentoScanId,
            data: new Date(),
            createdAt: new Date(),
          };

          this.tituloService.create(tituloData).subscribe(
            () => {
              this.closeModal();
              this.loadTitulos();
              this.errorMessage = null;
            },
            (error) => {
              console.error('Erro ao criar título:', error);
              this.errorMessage = error.error?.message || 'Erro ao criar título';
            },
          );
        },
        (error) => console.error('Erro ao fazer upload do documento:', error),
      );
    } else {
      console.error('Formulário inválido ou arquivo não selecionado');
    }
  }

  filterTitulosByNome(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTitulos = this.titulos.filter((titulo) =>
      titulo.nome.toLowerCase().includes(filterValue),
    );
  }

  filterTitulosByInstituicao(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTitulos = this.titulos.filter((titulo) =>
      titulo.instituicao.toLowerCase().includes(filterValue),
    );
  }

  filterTitulosByTipo(event: Event): void {
    const selectedTipoId = +(event.target as HTMLSelectElement).value;
    if (selectedTipoId) {
      this.filteredTitulos = this.titulos.filter((titulo) => titulo.tipoId === selectedTipoId);
    } else {
      this.filteredTitulos = this.titulos;
    }
  }

  getCategoriaNome(tipoId: number): string | undefined {
    const categoria = this.categoriasCertificado.find(cat => cat.id === tipoId);
    return categoria?.nome;
  }
}
