import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionarioAlunoService } from '../services/questionarioAluno.service';
import { AlunoService } from '../services/aluno.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { QuestionarioService } from '../services/questionario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gerenciar-turma-questionario',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './gerenciar-turma-questionario.component.html',
  styleUrls: ['./gerenciar-turma-questionario.component.scss'],
  providers: [ConfirmationService],
})
export class GerenciarTurmaQuestionarioComponent {
  displayDialog: boolean = false;
  alunos: any[] = [];
  selectedAluno: any;
  filteredAlunos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService,
    private location: Location,
  ) {
    this.initializeAlunos();
  }

  async initializeAlunos() {
    this.alunos = await this.alunoService.getAllWithTurmaByServidor();
    this.filteredAlunos = this.alunos;
  }

  showDialog(aluno: any) {
    this.selectedAluno = aluno;
    this.displayDialog = true;
  }

  clear(dt1: any) {
    dt1.clear();
    this.filteredAlunos = this.alunos;
  }

  filterAlunos(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredAlunos = this.alunos.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(query) ||
        aluno.nomeMae.toLowerCase().includes(query) ||
        aluno.ra.toLowerCase().includes(query),
    );
  }

  //   goInserirQuestionarioAluno(questionario: any) {
  //     this.router.navigate(['/gestao-academica/questionarios/resposta', { id: questionario.id, alunoId: this.alunoId }]);
  //   }

  formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }

    return idade;
  }

  goToQuestionarioAluno(aluno: any) {
    this.router.navigate(['/academico/questionarios/aluno', { alunoId: aluno.id }]);
  }

  goBack() {
    this.location.back();
  }
}

