import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { DocenteService } from '../services/docente.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-acompanhar-pontuacao',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    ListboxModule,
    ToastModule,
    InputTextareaModule,
  ],
  templateUrl: './acompanhar-pontuacao.component.html',
  providers: [MessageService],
  styleUrls: ['./acompanhar-pontuacao.component.scss'],
})
export class AcompanharPontuacaoComponent {
  assiduidadeData = [
    { ano: '2024', pontos: 1 },
    { ano: '2023', pontos: 2 },
    { ano: '2022', pontos: 1 },
    { ano: '2021', pontos: 2 },
  ];

  titulosData = [
    { nome: 'Curso 1', pontos: 0.5 },
    { nome: 'Curso 2', pontos: 1 },
    { nome: 'Curso 3', pontos: 1.5 },
    { nome: 'Curso 4', pontos: 1 },
  ];

  anosRestantes = 2;
  pontosRestantesAssiduidade = 1;
  pontosRestantesTitulos = 1;

  constructor() {}

  ngOnInit() {
    // Aqui você pode carregar dados de uma API, se necessário
  }

  // Método de exemplo para abrir modal de Ocorrências ou Títulos (pode ser customizado conforme necessário)
  abrirOcorrencias() {
    console.log('Abrindo ocorrências...');
  }

  abrirTitulos() {
    console.log('Abrindo títulos...');
  }
}
