import { Component, OnInit  } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { OcorrenciaService } from '../services/ocorrencia.service';
interface Ocorrencia {
  nome: string;
  matricula: string;
  data: string;
  status: string;
  abonada: string;
  tipo: string;
  observacao: string;
  atestado: string;
}

@Component({
  selector: 'app-gerenciar-ocorrencias',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './gerenciar-ocorrencias.component.html',
  styleUrls: ['./gerenciar-ocorrencias.component.scss'],
})
export class GerenciarOcorrenciasComponent implements OnInit {
  displayDialog: boolean = false;
  selectedOcorrencia: any;
  filteredOcorrencias: any[] = [];
  ocorrencias: any[] = []; // Lista que será preenchida com os dados reais

  constructor(private ocorrenciaService: OcorrenciaService) {}

  ngOnInit() {
    this.carregarOcorrencias(); // Chama o método para carregar os dados na inicialização
  }

  async carregarOcorrencias() {
    try {
      this.ocorrencias = await this.ocorrenciaService.index();
      this.filteredOcorrencias = this.ocorrencias; // Inicializa a lista filtrada
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    }
  }

  showDialog(ocorrencia: any) {
    this.selectedOcorrencia = ocorrencia;
    this.displayDialog = true;
  }

  clear(dt1: any) {
    dt1.clear(); // Limpa o campo de entrada
    this.filteredOcorrencias = this.ocorrencias; // Restaura a lista completa
  }

  filterOcorrencias(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredOcorrencias = this.ocorrencias.filter(
      (ocorrencia) =>
        ocorrencia.nome.toLowerCase().includes(query) ||
        ocorrencia.matricula.includes(query) ||
        ocorrencia.status.toLowerCase().includes(query),
    );
  }
}