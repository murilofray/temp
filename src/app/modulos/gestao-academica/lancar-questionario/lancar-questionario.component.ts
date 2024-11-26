import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { Calendar, CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { QuestionarioService } from '../services/questionario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { s } from '@fullcalendar/core/internal-common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-lancar-questionario',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    ListboxModule,
    InputMaskModule,
    ToastModule,
  ],
  templateUrl: './lancar-questionario.component.html',
  styleUrls: ['./lancar-questionario.component.scss'],
  providers: [MessageService],
})
export class LancarQuestionarioComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionarioService: QuestionarioService,
    private messageService: MessageService,
  ) {}

  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }

  displayDialog: boolean = false;
  selectedQuestao: any;

  questionario: {
    id: any;
    servidorId: Number;
    descricao: string;
    pergunta?: any[];
  } = {
    id: null,
    servidorId: 0,
    descricao: '',
  };

  questoes: {
    descricao: string;
    tipo: string;
    numero: number;
    opcoes?: any[];
  }[] = [];

  questao: {
    descricao: string;
    tipo: string;
    numero: number;
    opcoes?: any[];
  } = {
    descricao: '',
    tipo: '',
    numero: 0,
  };

  opcoes: {
    descricao: string;
  }[];

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    const decodedToken = this.parseJwt(token);

    this.questionario.servidorId = Number(decodedToken.id);

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.getQuestionario(params['id']).then(() => {
          if (params['clone']) {
            this.questionario.id = null;
          }
        });
      }
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

  async getQuestionario(id: number) {
    await this.questionarioService.getQuestionarioById(id).then(
      (response) => {
        this.questionario = {
          id: response.id,
          servidorId: response.Servidor.id,
          descricao: response.descricao,
        };

        this.questoes = response.Pergunta.map((pergunta) => {
          return {
            descricao: pergunta.descricao,
            tipo: pergunta.tipo,
            numero: pergunta.numero,
            opcoes: pergunta.Opcao.map((opcao) => {
              return {
                descricao: opcao.descricao,
              };
            }),
          };
        });
      },
      (error) => {
        this.showMessage('error', 'Erro ao buscar o questionário: ' + error.message);
      },
    );
  }

  atualizarQuantidade() {
    this.opcoes = [];
    for (let i = 0; i < this.questao.numero; i++) {
      this.opcoes.push({ descricao: '' });
    }
  }

  adicionarQuestao() {
    if (this.questao.descricao === '' || this.questao.tipo === '') {
      this.showMessage('error', 'Preencha todos os campos requeridos (*)');
      return;
    }

    if (this.questao.tipo === 'multiplaEscolha' && this.questao.numero < 2) {
      this.showMessage('error', 'Uma questão de múltipla escolha deve ter pelo menos duas opção');
      return;
    }

    if (
      this.questao.tipo === 'multiplaEscolha' &&
      this.opcoes.filter((o) => o.descricao != '').length != this.questao.numero
    ) {
      this.showMessage('error', 'Preencha todas as opções');
      return;
    }

    if (this.questao.tipo === 'escolhaUnica' && this.questao.numero < 1) {
      this.showMessage('error', 'Uma questão de escolha única deve ter pelo menos uma opção');
      return;
    }

    if (
      this.questao.tipo === 'escolhaUnica' &&
      this.opcoes.filter((o) => o.descricao != '').length != this.questao.numero
    ) {
      this.showMessage('error', 'Preencha todas as opções');
      return;
    }

    const novaQuestao = { ...this.questao, opcoes: this.opcoes };

    this.questoes.push(novaQuestao);

    this.questao = {
      descricao: '',
      tipo: '',
      numero: 0,
    };
    this.opcoes = [];
  }

  removerQuestao(questao: any) {
    if (this.questoes.length > 0) {
      this.questoes = this.questoes.filter((q) => q.descricao != questao.descricao);
    }
  }

  limpar() {
    this.questao = {
      descricao: '',
      tipo: '',
      numero: 0,
    };
    this.opcoes = [];
  }

  inserirQuestionario() {
    if (this.questionario.descricao === '') {
      this.showMessage('error', 'Preencha todos os campos requeridos (*)');
      return;
    }

    if (this.questoes.length === 0) {
      this.showMessage('error', 'O questionário deve conter pelo menos uma pergunta');
      return;
    }

    if (this.questionario.id != null) {
      this.questionarioService.updateQuestionario({ ...this.questionario, pergunta: this.questoes }).then(
        (response) => {
          this.showMessage('success', 'Questionário editado com sucesso!');

          setTimeout(() => {
            this.router.navigate(['/academico/questionarios']);
          }, 2000);
        },
        (error) => {
          this.showMessage('error', 'Erro ao editar o questionário: ' + error.message);
        },
      );
    } else {
      this.questionarioService.createQuestionario({ ...this.questionario, pergunta: this.questoes }).then(
        (response) => {
          this.showMessage('success', 'Questionário cadastrado com sucesso!');
          setTimeout(() => {
            this.router.navigate(['/academico/questionarios']);
          }, 2000);
        },
        (error) => {
          this.showMessage('error', 'Erro ao cadastrar o questionário: ' + error.message);
        },
      );
    }
  }

  cancelar() {
    this.router.navigate(['/academico/questionarios']);
  }

  showDialog(questao: any) {
    this.selectedQuestao = questao;
    this.displayDialog = true;
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
}

