import { Component } from '@angular/core';
import { Aluno } from '../model/aluno';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EscolaService } from 'src/app/comum/services/escola.service';
import { UserInfoService } from 'src/app/utils/services/user.service';
import { AlunoService } from '../services/aluno/aluno.service';
import { TurmaService } from '../services/turma/turma.service';
import { Servidor } from '../model/servidor';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-realizar-transferencia',
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
    RadioButtonModule
  ],
  providers: [ConfirmationService],
  templateUrl: './realizar-transferencia.component.html',
  styleUrl: './realizar-transferencia.component.scss'
})
export class RealizarTransferenciaComponent {

  public alunosEscola: Aluno[] = []

  public user;
  public userServidor: Servidor;

  public alunoSelecionado: Aluno;

  public transferenciaExterna: string;

  public isLoading: boolean = false;

  public isRealizarTransferenciaDialogOpen: boolean = false

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

    this.alunoService.getAlunosByEscola(this.userServidor.escolaId).then((alunos) => {
      this.alunosEscola = alunos
    })

    this.isLoading = false
  }

  getUserInfo() {
    this.user = this.userService.getUserInfo()
    this.userServidor = this.user.user
  }

  async realizarTransferenciaExterna() {
    if(this.alunoSelecionado){
      let resposta = await this.alunoService.desabilitarAluno(this.alunoSelecionado.id)

      if(resposta.success){

        this.alunosEscola = this.alunosEscola.filter(x => x.id !== this.alunoSelecionado.id)

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: resposta.message,
        })
      }else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: resposta.message,
        })
      }
    }

    this.alunoSelecionado = null;
    this.isRealizarTransferenciaDialogOpen = false
  }

  async realizarTransferenciaInterna() {
    if(this.alunoSelecionado){
      let resposta = await this.alunoService.desvincularAlunoDaTurma(this.alunoSelecionado.id)

      if(resposta.success){

        this.alunosEscola = this.alunosEscola.filter(x => x.id !== this.alunoSelecionado.id)

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: resposta.message,
        })
      }else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: resposta.message,
        })
      }
    }

    this.alunoSelecionado = null;
    this.isRealizarTransferenciaDialogOpen = false
  }

  realizarTransferenciaDialog() {
    if (this.transferenciaExterna == 'externo') {
      this.confirmationService.confirm({
        message: 'Deseja realizar essa transferência? O aluno selecionado perderá o vínculo com o sistema e ficará desabilitado até que seja habilitado novamente.',
        header: 'Confirmação',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Transferir',

        accept: () => {
          this.realizarTransferenciaExterna();
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'Deseja realizar essa transferência? O aluno selecionado perderá o vínculo com a turma atual.',
        header: 'Confirmação',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Transferir',

        accept: () => {
          this.realizarTransferenciaInterna();
        },
      });
    }


  }
}
