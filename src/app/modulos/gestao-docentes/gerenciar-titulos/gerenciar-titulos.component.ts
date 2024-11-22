import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TituloService } from '../services/titulo.service';
import { DocumentoService } from '../services/documento.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-gerenciar-titulos',
  templateUrl: './gerenciar-titulos.component.html',
  styleUrls: ['./gerenciar-titulos.component.scss'],
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
export class GerenciarTitulosComponent implements OnInit {
  titulos: any[] = [];
  filteredTitulos: any[] = [];
  deletedTitulos: any[] = []; // Vetor para armazenar títulos deletados
  tituloForm!: FormGroup;
  isModalOpen = false;
  selectedTitulo: any = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private documentoService: DocumentoService,
  ) {}

  ngOnInit(): void {
    this.loadTitulos();
    this.loadDeletedTitulos(); // Carregar títulos deletados
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

  loadDeletedTitulos(): void {
    this.tituloService.getDeleted().subscribe(
      (data) => {
        this.deletedTitulos = data;
      },
      (error) => console.error('Erro ao carregar títulos deletados:', error),
    );
  }

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
      this.filteredTitulos = this.titulos;
    }
  }

  // Função para filtrar por status
  filterTitulosByStatus(event: Event) {
    const selectedStatus = (event.target as HTMLSelectElement).value;

    if (selectedStatus === 'Excluido') {
      this.filteredTitulos = this.deletedTitulos; // Exibe apenas títulos deletados
    } else if (selectedStatus) {
      this.filteredTitulos = this.titulos.filter(
        (titulo) => titulo.status === selectedStatus && titulo.deletedAt == null,
      );
    } else {
      this.filteredTitulos = this.titulos.filter((titulo) => titulo.deletedAt == null);
    }
  }

  verDocumento(documentoScanId: number): void {
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
  }

  aceitarTitulo(id: any): void {
    this.tituloService.aceitar(id).subscribe(
      () => {
        this.loadTitulos();
      },
      (error) => console.error('Erro ao aprovar título:', error),
    );
  }

  recusarTitulo(id: any): void {
    this.tituloService.recusar(id).subscribe(
      () => {
        this.loadTitulos();
      },
      (error) => console.error('Erro ao recusar título:', error),
    );
  }

  deletarTitulo(id: any): void {
    this.tituloService.delete(id).subscribe(
      () => {
        this.loadTitulos();
        this.loadDeletedTitulos();
      },
      (error) => console.error('Erro ao deletar título:', error),
    );
  }

  // Função para restaurar título deletado
  restaurarTitulo(id: number): void {
    this.tituloService.restaurar(id).subscribe(
      () => {
        this.loadDeletedTitulos();
        this.loadTitulos();
      },
      (error) => console.error('Erro ao restaurar título:', error),
    );
  }
}
