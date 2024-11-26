import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { EscolaService } from 'src/app/comum/services/escola.service';
import { UserInfoService } from 'src/app/utils/services/user.service';
import { AlunoService } from '../services/aluno/aluno.service';
import { TurmaService } from '../services/turma/turma.service';
import { Aluno } from '../model/aluno';
import { Turma } from '../model/turma';
import { Servidor } from 'src/app/comum/model/servidor';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-realizar-matricula',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToolbarModule,
    ListboxModule,
    RouterModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './realizar-matricula.component.html',
  styleUrl: './realizar-matricula.component.scss'
})
export class RealizarMatriculaComponent {

  public isLoading: boolean = false
  public alunosSemTurma: Aluno[] = [];
  public alunoSelecionado: Aluno;

  public matriculaForm!: FormGroup;
  public isMatriculaDialogOpen: boolean = false

  public user;
  public userServidor: Servidor;

  public turmas: Turma[] = [];
  public turmaSelecionada: Turma;

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private escolaService: EscolaService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public userService: UserInfoService
  ) {

  }


  ngOnInit() {

    this.isLoading = true

    this.getUserInfo()

    this.alunoService.getAlunosSemTurma().then((data) => {
      this.alunosSemTurma = data
    }).catch((err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao listar os alunos.',
      })
    })

    this.turmaService.getTurmaByEscolaComDescricao(this.userServidor.escolaId).then((turmas) => {
      this.turmas = turmas;
    }).catch((err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao listar as turmas.',
      })
    })

    this.initForms()

    this.isLoading = false
  }

  getUserInfo() {
    this.user = this.userService.getUserInfo()

    this.userServidor = this.user.user
  }

  initForms(): void {
    this.matriculaForm = this.fb.group({
      aluno: ['', Validators.required],
    });
  }

  matriculaDialog() {
    this.matriculaForm.reset({ 'aluno': this.alunoSelecionado.id })
    this.isMatriculaDialogOpen = true
  }

  async realizarMatricula() {
    const aluno = this.matriculaForm.get('aluno').value

    if (this.turmaSelecionada) {

      let response = await this.alunoService.realizarMatricula(this.turmaSelecionada.id, aluno)

      if (response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: response.message,
        })

        this.alunoSelecionado = null;
        this.alunosSemTurma = this.alunosSemTurma.filter(x => x.id !== aluno)
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        })
      }

      this.isMatriculaDialogOpen = false
    }

    this.matriculaForm.reset()
  }
}
