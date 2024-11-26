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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-gerenciar-questionario-aluno',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './gerenciar-questionario-aluno.component.html',
  styleUrls: ['./gerenciar-questionario-aluno.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class GerenciarQuestionarioAlunoComponent {
  alunoId: number;
  aluno: any;

  displayDialog: boolean = false;
  selectedQuestionarioAluno: any;
  filteredQuestionariosAluno: any[] = [];
  questionariosAluno: any[] = [];
  displayDialogNovoQuestionario: boolean = false;

  filteredQuestionarios: any[] = [];
  questionarios: any[] = [];

  servidorId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionarioAlunoService: QuestionarioAlunoService,
    private alunoService: AlunoService,
    private confirmationService: ConfirmationService,
    private questionarioService: QuestionarioService,
    private location: Location,
    private messageService: MessageService,
  ) {
    this.initializeQuestionarios();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['alunoId']) {
        this.alunoId = params['alunoId'];
      }
      this.initializeAluno();
      this.initializeQuestionariosAluno();

      const token = localStorage.getItem('jwt');
      const decodedToken = this.parseJwt(token);

      this.servidorId = decodedToken?.id;
    });
  }

  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }

  parseJwt(token: string): any {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);

      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }

  async initializeQuestionarios() {
    this.questionarios = await this.questionarioService.getQuestionarios();
    this.filteredQuestionarios = this.questionarios;
  }

  async initializeAluno() {
    this.aluno = await this.alunoService.getAlunoById(this.alunoId);
    console.log(this.aluno);
  }

  async initializeQuestionariosAluno() {
    this.questionariosAluno = await this.questionarioAlunoService.getQuestionarioAlunoByAlunoId(this.alunoId);
    this.filteredQuestionariosAluno = this.questionariosAluno;
  }

  showDialog(questionarioAluno: any) {
    this.selectedQuestionarioAluno = questionarioAluno;
    this.displayDialog = true;
  }

  clear(dt1: any) {
    dt1.clear();
    this.filteredQuestionariosAluno = this.questionariosAluno;
  }

  filterQuestionariosAluno(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredQuestionariosAluno = this.questionariosAluno.filter(
      (questionarioAluno) =>
        questionarioAluno.Resposta[0].Pergunta.Questionario.descricao.toLowerCase().includes(query) ||
        this.formatarData(questionarioAluno.createdAt).includes(query) ||
        questionarioAluno.Servidor?.nome.toLowerCase().includes(query),
    );
  }

  goInserirQuestionarioAluno(questionario: any) {
    this.router.navigate(['/academico/questionarios/resposta', { id: questionario.id, alunoId: this.alunoId }]);
  }

  formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarTipoQuestao(tipo: string) {
    switch (tipo) {
      case 'texto':
        return 'Texto';
      case 'multiplaEscolha':
        return 'Múltipla Escolha';
      case 'verdadeiroFalso':
        return 'Verdadeiro ou Falso';
      case 'numerica':
        return 'Numérica';
      case 'escolhaUnica':
        return 'Escolha Única';
      default:
        return tipo;
    }
  }

  deleteQuestionarioAluno(questionarioAluno: any) {
    this.questionarioAlunoService.deleteQuestionarioAluno(questionarioAluno.id).then(
      (response) => {
        this.showMessage('success', 'Questionário deletado com sucesso!');

        this.initializeQuestionariosAluno();
      },
      (error) => {
        this.showMessage('error', 'Erro ao deletar o Questionário!');
      },
    );
  }

  confirmDelete(questionario: any) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o questionário <strong>"${questionario.Resposta[0].Pergunta.Questionario.descricao}"</strong> do aluno <strong>"${questionario.Aluno.nome} (RA: ${questionario.Aluno.ra})"</strong>?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteQuestionarioAluno(questionario);
      },
    });
  }

  showDialogNovoQuestionario() {
    this.displayDialogNovoQuestionario = true;
  }

  filterQuestionarios(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredQuestionarios = this.questionarios.filter(
      (questionario) =>
        questionario.descricao.toLowerCase().includes(query) ||
        this.formatarData(questionario.dataCriacao).includes(query) ||
        questionario.Servidor?.nome.toLowerCase().includes(query),
    );
  }

  goBack() {
    this.location.back();
  }
}

