import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TurmaService } from '../services/turma/turma.service';
import { RelatorioService } from '../services/relatorio/relatorio.service';

interface Turma {
  id: number;
  ano: number;
  letra: string;
  anoLetivo: number;
  descricao: string;
}

interface TurmaRelatorio {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-gerenciar-relatorios',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    ToolbarModule,
    ListboxModule,
    RouterModule,
    FormsModule, 
  ],
  providers: [ConfirmationService],
  templateUrl: './gerenciar-relatorios.component.html',
  styleUrls: ['./gerenciar-relatorios.component.scss']
})
export class GerenciarRelatoriosComponent {
  relatorioBeneficiariosDialogVisivel: boolean = false;

  turmas: Turma[] = [];
  turmasRelatorio: TurmaRelatorio[] = [];
  turmaRelatorio: TurmaRelatorio;

  constructor(
    private turmaService: TurmaService,
    private relatorioService: RelatorioService,
  ) {}

  ngOnInit() {
    this.turmaService.getTurmasDescricao().then((data) => {
      this.turmas = data;
      this.turmasRelatorio = [{ id: -1, descricao: 'Todas' }, ...this.turmas];
    });
  }

  async downloadRelatorio() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.downloadRelatorioBeneficiarios(this.turmaRelatorio.id);
    } else {
      console.error('Nenhuma turma selecionada para o relatório.');
    }
  }

  async imprimirRelatorio() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.printRelatorioBeneficiarios(this.turmaRelatorio.id);
    } else {
      console.error('Nenhuma turma selecionada para o relatório.');
    }
  }
}
