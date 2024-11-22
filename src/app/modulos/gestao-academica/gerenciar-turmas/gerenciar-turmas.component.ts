import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TurmaService } from '../services/turma/turma.service';
import { EscolaService } from '../../../comum/services/escola.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlunoService } from '../services/aluno/aluno.service';

interface Escola {
  id?: number;
  nome: string;
}

interface Turma {
  id: number;
  escolaId: number;
  servidorId: number;
  anoLetivo: number | null;
  ano: number | null;
  letra: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  Escola: Escola;
}


@Component({
  selector: 'app-gerenciar-turmas',
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
  templateUrl: './gerenciar-turmas.component.html',
  styleUrl: './gerenciar-turmas.component.scss'
})
export class GerenciarTurmasComponent {

  public turmas: Turma[];
  public turmaSelecionada: Turma;
  public turmaDetalhes: Turma;
  public detalheTurmaVisivel = false;

  public turmaDetalhesAlunos: [] = [];

  public turmaForm!: FormGroup;

  public isCadastrarTurmaOpen: boolean = false

  public escolas: Escola[];

  errorMessage: string | null = null;

  @ViewChild('dt1') turmasTable: Table;

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private escolaService: EscolaService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit() {
    this.turmaService.getTurmas().then((data) => {
      this.turmas = data
    })
    this.initForms()
    this.escolaService.getEscolas().then((data) => {
      this.escolas = data;
    });
  }

  initForms(): void {
    this.turmaForm = this.fb.group({
      escola: ['', Validators.required],
      letra: ['', Validators.required],
      ano: ['', Validators.required],
      anoLetivo: ['', Validators.required],
    });
  }

  criarTurma() {
    const escola = this.turmaForm.get('escola').value
    const servidor = 2
    const ano = this.turmaForm.get('ano').value
    const anoLetivo = this.turmaForm.get('anoLetivo').value
    const letra = this.turmaForm.get('letra').value

    this.turmaService.cadastrarTurma(
      +escola,
      +servidor,
      ano,
      anoLetivo,
      letra
    ).then((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Turma criada com sucesso!',
      })

      this.turmas.push({
        ano: data.ano,
        anoLetivo: data.anoLetivo,
        createdAt: data.createdAt,
        deletedAt: data.deletedAt,
        escolaId: data.escolaId,
        Escola: { nome: (this.escolas.find((x: any) => x.id == data.escolaId).nome) },
        id: data.id,
        letra: data.letra,
        servidorId: data.servidorId,
        updatedAt: data.updatedAt
      })

    })

    this.isCadastrarTurmaOpen = false
    this.turmaForm.reset()
    this.turmasTable.reset()
  }

  async detalhesTurma(turma: Turma){
    this.turmaDetalhes = turma;
    this.detalheTurmaVisivel = true

    this.turmaDetalhesAlunos = await this.alunoService.getAlunosByTurmaId(turma.id)
    console.log(this.turmaDetalhesAlunos)
  }

  deletarTurmaDialog() {
    this.confirmationService.confirm({
      message: 'Deseja deletar essa turma?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Deletar',

      accept: () => {
        this.deletarTurma();
      },
    });
  }

  deletarTurma(){
    this.turmaService.deletarTurma(this.turmaSelecionada.id).then((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: data.data.message,
      })

      this.turmas = this.turmas.filter((x) => x.id != this.turmaSelecionada.id)
      this.turmaSelecionada = null;
    }).catch((err) => {
      if(err.response.data.resposta.data == 400){
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: "Impossível de deletar, pois há alunos associados a esta turma.",
        })
      }
    })

    this.turmasTable.reset();
  }

}
