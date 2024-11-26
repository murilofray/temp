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
import { QuestionarioAlunoService } from '../services/questionarioAluno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { AlunoService } from '../services/aluno.service';
import { s } from '@fullcalendar/core/internal-common';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-lancar-questionario-aluno',
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
  templateUrl: './lancar-questionario-aluno.component.html',
  styleUrls: ['./lancar-questionario-aluno.component.scss'],
  providers: [MessageService],
})
export class LancarQuestionarioAlunoComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionarioService: QuestionarioService,
    private questionarioAlunoService: QuestionarioAlunoService,
    private alunoService: AlunoService,
    private location: Location,
    private messageService: MessageService,
  ) {}
  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }
  aluno: any;

  questionarioDescricao: string = '';

  questionarioAluno: {
    id: any;
    servidorId: Number;
    alunoId: Number;
    resposta?: any[];
  } = {
    id: null,
    servidorId: 0,
    alunoId: 0,
  };

  questoes: {
    id: any;
    descricao: string;
    tipo: string;
    numero: number;
    opcoes?: any[];
  }[] = [];

  respostas: {
    perguntaId: number;
    resposta: string;
    respostas?: any[];
  }[] = [];

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    const decodedToken = this.parseJwt(token);

    this.questionarioAluno.servidorId = Number(decodedToken.id);

    this.route.params.subscribe((params) => {
      if (params['id'] && params['alunoId']) {
        this.questionarioAluno.alunoId = Number(params['alunoId']);
        this.initializeAluno();
        this.getQuestionario(params['id']);
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

  async initializeAluno() {
    this.aluno = await this.alunoService.getAlunoById(this.questionarioAluno.alunoId);
  }

  async getQuestionario(id: number) {
    await this.questionarioService.getQuestionarioById(id).then(
      (response) => {
        this.questionarioDescricao = response.descricao;

        this.questoes = response.Pergunta.map((pergunta) => {
          return {
            id: pergunta.id,
            descricao: pergunta.descricao,
            tipo: pergunta.tipo,
            numero: pergunta.numero,
            opcoes: pergunta.Opcao.map((opcao) => {
              return {
                id: opcao.id,
                descricao: opcao.descricao,
              };
            }),
          };
        });

        this.respostas = this.questoes.map((questao) => ({
          perguntaId: questao.id,
          tipo: questao.tipo,
          resposta: '',
          respostas: [],
        }));

        this.renderizarQuestoes();
      },
      (error) => {
        this.showMessage('error', 'Erro ao buscar o questionário: ' + error.message);
      },
    );
  }

  criarCampo(label: HTMLElement, input: HTMLElement, checkbox = false) {
    const fieldDiv = document.createElement('div');
    fieldDiv.classList.add('field');

    if (checkbox) {
      label.classList.add('label');
      input.classList.add('input');

      fieldDiv.appendChild(input);
      fieldDiv.appendChild(label);
    } else {
      label.classList.add('label');
      input.classList.add('p-inputtext');
      input.classList.add('p-component');
      input.classList.add('p-element');
      input.classList.add('full-width');
      input.style.width = '100%';

      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
    }

    return fieldDiv;
  }

  renderizarQuestoes() {
    const formContainer = document.getElementById('form-container');

    if (!formContainer) return;

    this.questoes.forEach((questao) => {
      // Descrição da questão
      const label = document.createElement('h6');
      label.textContent = questao.descricao + '*';

      let input;

      switch (questao.tipo) {
        case 'texto':
          input = document.createElement('input');
          input.type = 'text';

          input.addEventListener('input', (event: any) => {
            const resposta = this.respostas.find((res) => res.perguntaId === questao.id);
            if (resposta) {
              resposta.resposta = event.target.value;
            }
          });
          break;

        case 'multiplaEscolha':
          input = document.createElement('div');
          questao.opcoes?.forEach((opcao) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = opcao.id;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = opcao.descricao;

            const checkboxContainer = this.criarCampo(checkboxLabel, checkbox, true); // Adicionar classe ao checkbox e label

            input.appendChild(checkboxContainer);

            checkbox.addEventListener('change', () => {
              const resposta = this.respostas.find((res) => res.perguntaId === questao.id);
              if (resposta) {
                if (checkbox.checked) {
                  resposta.respostas.push(opcao);
                } else {
                  resposta.respostas = resposta.respostas.filter((item) => item !== opcao);
                }
              }
            });
          });
          break;

        case 'verdadeiroFalso':
          input = document.createElement('select');

          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'Selecione uma opção';
          option.disabled = true;
          option.selected = true;
          input.appendChild(option);

          ['Verdadeiro', 'Falso'].forEach((opcao) => {
            const option = document.createElement('option');
            option.value = opcao;
            option.textContent = opcao;
            input.appendChild(option);
          });

          input.addEventListener('change', (event: any) => {
            const resposta = this.respostas.find((res) => res.perguntaId === questao.id);
            if (resposta) {
              resposta.resposta = event.target.value;
            }
          });
          break;

        case 'numerica':
          input = document.createElement('input');
          input.type = 'number';

          input.addEventListener('input', (event: any) => {
            const resposta = this.respostas.find((res) => res.perguntaId === questao.id);
            if (resposta) {
              resposta.resposta = event.target.value;
            }
          });
          break;

        case 'escolhaUnica':
          input = document.createElement('select');

          const optionEscolha = document.createElement('option');
          optionEscolha.value = '';
          optionEscolha.textContent = 'Selecione uma opção';
          optionEscolha.disabled = true;
          optionEscolha.selected = true;

          input.appendChild(optionEscolha);

          questao.opcoes?.forEach((opcao) => {
            const option = document.createElement('option');
            option.value = opcao.descricao;
            option.textContent = opcao.descricao;
            input.appendChild(option);
          });

          input.addEventListener('change', (event: any) => {
            const resposta = this.respostas.find((res) => res.perguntaId === questao.id);
            if (resposta) {
              resposta.resposta = event.target.value;
            }
          });
          break;
      }

      // Adicionar label e input ao campo estilizado
      const campo = this.criarCampo(label, input);

      formContainer.appendChild(campo);
    });
  }

  validarRespostas(respostas: any[]): boolean {
    for (const resposta of respostas) {
      if (resposta.tipo === 'multiplaEscolha' && resposta.respostas.length === 0) {
        return false;
      }

      if (resposta.tipo === 'texto' && !resposta.resposta) {
        return false;
      }
    }
    return true;
  }

  inserirQuestionario() {
    if (!this.validarRespostas(this.respostas)) {
      this.showMessage('error', 'Preencha todos os campos obrigatórios (*)');
      return;
    }

    this.questionarioAlunoService.createQuestionarioAluno({ ...this.questionarioAluno, resposta: this.respostas }).then(
      (response) => {
        this.showMessage('success', 'Questionário cadastrado com sucesso!');

        setTimeout(() => {
          this.location.back();
        }, 2000);
      },
      (error) => {
        this.showMessage('error', 'Erro ao cadastrar o questionário: ' + error.message);
      },
    );
  }

  cancelar() {
    this.location.back();
  }
}

