import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TituloService } from '../services/titulo.service'; // Serviço para gerenciar títulos
import { ServidorService } from '../../../comum/services/servidor.service'; // Serviço para gerenciar servidores
import { DocumentoService } from '../services/documento.service'; // Serviço para gerenciar documentos
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'; // Adicionando módulo para dropdown
import { CalendarModule } from 'primeng/calendar'; // Adicionando módulo para calendário
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { jwtDecode } from 'jwt-decode'; // Importando jwt-decode
import { TableModule } from 'primeng/table'; // Importando o módulo Table

export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

const tipoTituloValores = {
  Mestrado: { fator: 0.02, maxPontos: 9999999999999999999999999999999 },
  Doutorado: { fator: 0.04, maxPontos: 9999999999999999999999999999999 },
  Cursos: { fator: 0.003, maxPontos: 4 },
};

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
    DropdownModule, // Importando módulo de dropdown
    CalendarModule, // Importando módulo de calendário
    TableModule,
  ],
})

export class LancarTitulosComponent implements OnInit {
  titulos: any[] = []; // Lista de títulos
  filteredTitulos: any[] = []; // Títulos filtrados
  servidores: any[] = []; // Lista de servidores para o select
  documentoScanId: number | null = null; // ID do documento escaneado
  tituloForm!: FormGroup; // Formulário para os títulos
  isModalOpen = false; // Controle do modal de lançamento
  selectedFile: File | null = null; // Arquivo selecionado

  errorMessage: string | null = null; // Mensagem de erro
  servidorId: number | null = null; // ID do servidor logado
  servidorNome: string; // Nome do servidor obtido do token

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private servidorService: ServidorService,
    private documentoService: DocumentoService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadServidores(); // Carrega a lista de servidores
    this.loadTitulos(); // Carrega a lista de títulos
    this.getServidorFromToken(); // Obtém o servidor do token
  }

  getServidorFromToken(): void {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      this.servidorId = decodedToken.id;
      this.servidorNome = decodedToken.nome;
      this.tituloForm.patchValue({ servidorId: this.servidorId }); // Preenche o formulário com o ID do servidor
    }
  }

  initForms(): void {
    this.tituloForm = this.fb.group({
      servidorId: [this.servidorId],
      documentoScanId: [''],
      nome: ['', Validators.required],
      instituicao: ['', Validators.required],
      tipo: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
      pontos: [{ value: '', disabled: true }], // Pontos calculados automaticamente
      dataConclusao: ['', Validators.required],
      validade: ['', Validators.required], // Validade obrigatória por padrão
      aprovadoPor: [''], // Opcional
    });
  
    // Atualizar pontos automaticamente
    this.tituloForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      const cargaHoraria = this.tituloForm.get('cargaHoraria')?.value || 0;
      const pontosCalculados = this.calcularPontos(tipo, cargaHoraria);
      this.tituloForm.get('pontos')?.setValue(pontosCalculados);
  
      // Desabilitar/habilitar o campo validade baseado no tipo
      if (tipo === 'Mestrado' || tipo === 'Doutorado') {
        this.tituloForm.get('validade')?.disable(); // Desabilitar campo
        this.tituloForm.get('validade')?.reset(); // Limpar valor
      } else {
        this.tituloForm.get('validade')?.enable(); // Habilitar campo
      }
    });
  }
  
  loadServidores(): void {
    this.servidorService.getAll().subscribe(
      (data) => {
        this.servidores = data;
      },
      (error) => console.error('Erro ao carregar servidores:', error),
    );
  }

  loadTitulos(): void {
    this.tituloService.getAll().subscribe(
      (data) => {
        this.titulos = data;
        this.filteredTitulos = data; // Inicializa a lista filtrada
      },
      (error) => console.error('Erro ao carregar títulos:', error),
    );
  }

  calcularPontos(tipo: string, cargaHoraria: number): number {
    const tipoConfig = tipoTituloValores[tipo] || { fator: 0, maxPontos: Infinity }; // Configuração padrão
    let pontos = parseFloat((tipoConfig.fator * cargaHoraria).toFixed(2));
  
    // Valida o valor máximo de pontos
    if (pontos > tipoConfig.maxPontos) {
      pontos = tipoConfig.maxPontos;
    }
  
    return pontos;
  }

  // Filtros
  filterTitulosByNome(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTitulos = this.titulos.filter((titulo) => titulo.nome.toLowerCase().includes(filterValue));
  }

  filterTitulosByInstituicao(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTitulos = this.titulos.filter((titulo) => titulo.instituicao.toLowerCase().includes(filterValue));
  }

  filterTitulosByTipo(event: Event) {
    const selectedTipo = (event.target as HTMLSelectElement).value;
    if (selectedTipo) {
      this.filteredTitulos = this.titulos.filter((titulo) => titulo.tipo === selectedTipo);
    } else {
      this.filteredTitulos = this.titulos; // Resetar se "Todos os Tipos" for selecionado
    }
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
    this.tituloForm.reset(); // Reseta o formulário ao fechar
    this.selectedFile = null; // Reseta o arquivo selecionado
  }

  createTitulo(): void {
    console.log('Criando Titulo:', this.tituloForm.value);
    console.log('Arquivo selecionado:', this.selectedFile);
  
    if (this.tituloForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('pdf', this.selectedFile);
      formData.append('tipoDocumentoId', '1');
  
      this.documentoService.createDocumentoScan(formData).subscribe(
        (response) => {
          const documentoScanId = response.id;
  
          const tituloData = {
            ...this.tituloForm.value,
            pontos: this.tituloForm.get('pontos')?.value, // Pontos calculados
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

  verDocumento(documentoScanId: number): void {
    if (documentoScanId) {
      this.documentoService.getDocumentoCaminho(documentoScanId).subscribe(
        (response) => {
          if (response.caminho) {
            const pdfUrl = `http://localhost:3333/docs/${response.caminho}`;
            window.open(pdfUrl, '_blank');
          } else {
            console.error('Caminho do documento não encontrado.');
          }
        },
        (error) => console.error('Erro ao carregar o documento:', error),
      );
    } else {
      console.error('ID do documento escaneado não fornecido.');
    }
  }
  // Validator para verificar se a data de conclusão não é no futuro
  validarDataConclusao(control: AbstractControl): ValidationErrors | null {
    const dataConclusao = new Date(control.value);
    const hoje = new Date();

    if (dataConclusao > hoje) {
      return { dataFutura: true }; // Retorna erro se a data for futura
    }
    return null;
  }

  get dataConclusaoInvalida(): boolean {
    return this.tituloForm.get('dataConclusao')?.errors?.['dataFutura'] || false;
  }
}
