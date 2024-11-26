import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { EscolaService } from '../services/escola.service';
import { Router } from '@angular/router';
import { QuestionarioService } from '../services/questionario.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-gerenciar-questionario',
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
  templateUrl: './gerenciar-questionario.component.html',
  styleUrls: ['./gerenciar-questionario.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class GerenciarQuestionarioComponent {
  displayDialog: boolean = false;
  selectedQuestionario: any;
  filteredQuestionarios: any[] = [];
  questionarios: any[] = [];

  constructor(
    private router: Router,
    private questionarioService: QuestionarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.initializeQuestionarios();
  }

  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }

  async initializeQuestionarios() {
    this.questionarios = await this.questionarioService.getQuestionarios();
    this.filteredQuestionarios = this.questionarios; // Inicializa a lista filtrada
  }

  showDialog(questionario: any) {
    this.selectedQuestionario = questionario;
    this.displayDialog = true;
  }

  clear(dt1: any) {
    dt1.clear(); // Limpa o campo de entrada
    this.filteredQuestionarios = this.questionarios; // Restaura a lista completa
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

  goInserirQuestionario() {
    this.router.navigate(['/academico/questionarios/inserir']);
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

  deleteQuestionario(questionario: any) {
    this.questionarioService.deleteQuestionario(questionario.id).then(
      (response) => {
        this.showMessage('success', 'Questionário deletado com sucesso!');

        this.initializeQuestionarios();
      },
      (error) => {
        this.showMessage('error', 'Erro ao deletar o Questionário!');
      },
    );
  }

  goEditarQuestionario(questionario: any) {
    this.router.navigate(['/academico/questionarios/editar', { id: questionario.id }]);
  }

  goClonarQuestionario(questionario: any) {
    this.router.navigate(['/academico/questionarios/inserir', { id: questionario.id, clone: true }]);
  }

  confirmDelete(questionario: any) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o questionário <strong>"${questionario.descricao}"</strong>?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteQuestionario(questionario);
      },
    });
  }
}

