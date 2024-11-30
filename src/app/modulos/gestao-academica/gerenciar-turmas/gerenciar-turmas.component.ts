import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { jwtDecode } from 'jwt-decode';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { UserInfoService } from 'src/app/utils/services/user.service';
import { JwtPayload } from '../model/jwtPayload';
import { Escola } from '../model/escola';
import { Servidor } from '../model/servidor';
import { Turma } from '../model/turma';
import { DividerModule } from 'primeng/divider';

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
    DividerModule
  ],
  providers: [ConfirmationService],
  templateUrl: './gerenciar-turmas.component.html',
  styleUrl: './gerenciar-turmas.component.scss'
})
export class GerenciarTurmasComponent {

  public niveis = NivelAcessoEnum

  public isUserAdmin: boolean = false
  public isLoading: boolean = false

  public turmas: Turma[];
  public turmasRematriculas: Turma[];

  public turmaSelecionada: Turma;
  public turmaRematricula: Turma;
  public turmaDetalhes: Turma;
  public detalheTurmaVisivel = false;

  public turmaDetalhesAlunos: [] = [];
  public alunosTurma: [] = [];

  public turmaForm!: FormGroup;
  public editarTurmaForm!: FormGroup;

  public isCadastrarTurmaOpen: boolean = false
  public isEditarTurmaOpen: boolean = false
  public isRematricularDialogOpen: boolean = false
  public isAlunosDaTurmaDialog: boolean = false

  public escolas: Escola[] = [];

  public escola: Escola;
  public servidor: Servidor;

  public docentesEscola: Servidor[] = [];

  public docentesEscolaAdmin: Servidor[] = []; // Apenas para ADMIN

  public user;

  errorMessage: string | null = null;

  @ViewChild('dt1') turmasTable: Table;

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private escolaService: EscolaService,
    private fb: FormBuilder,
    private servidorService: ServidorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public userService: UserInfoService
  ) {

  }

  ngOnInit() {
    this.isLoading = true

    this.escolaService.getEscolas().then((data) => {
      this.escolas = data;

      this.getUserInfo()
      this.isLoading = false
    });

    this.initForms()

  }

  async getUserInfo() {
    try {
      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        const decodedToken: JwtPayload = jwtDecode(tokenJWT);
        const jwtServidor = decodedToken['servidor']
        this.user = jwtServidor
        const servidorId = jwtServidor.id;

        let servidor = await this.servidorService.buscarServidorPorId(servidorId)
        this.servidor = servidor

        if (this.userService.podeRealizarEssaFuncao(this.user.NivelAcessoServidor, [NivelAcessoEnum.ADMINISTRADOR])) { // ADMIN
          this.isUserAdmin = true

          this.turmaService.getTurmasDescricao().then((data) => {
            this.turmas = data
          })
        } else {
          this.escola = this.escolas.find(x => x.id == this.servidor.Escola.id)


          // Forms
          this.turmaForm.patchValue({
            escola: this.escola.id,
          });

          this.editarTurmaForm.patchValue({
            escola: this.escola.id,
          });

          this.servidorService.buscarServidorPorNivelAcessoAndEscola(this.escola.id, NivelAcessoEnum.DOCENTE.id).then((data) => {
            this.docentesEscola = data
          })

          this.turmaService.getTurmaByEscolaComDescricao(this.servidor.escolaId).then((data) => {
            this.turmas = data
          })
        }
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao identificar o usuário.',
      })

      this.router.navigateByUrl("/")
    }
  }

  initForms(): void {
    this.turmaForm = this.fb.group({
      escola: ['', Validators.required],
      docente: ['', Validators.required],
      letra: ['', Validators.required],
      ano: ['', Validators.required],
      anoLetivo: ['', Validators.required],
    });

    this.editarTurmaForm = this.fb.group({
      escola: ['', Validators.required],
      docente: ['', Validators.required],
      letra: ['', Validators.required],
      ano: ['', Validators.required],
      anoLetivo: ['', Validators.required],
    });
  }

  criarTurma() {
    const escola = this.turmaForm.get('escola').value
    const servidor = this.turmaForm.get('docente').value
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
        descricao: `${data.ano} ${data.letra} ${data.anoLetivo}`,
        createdAt: data.createdAt,
        deletedAt: data.deletedAt,
        escolaId: data.escolaId,
        Escola: { nome: (this.escolas.find((x: any) => x.id == data.escolaId).nome) },
        id: data.id,
        letra: data.letra,
        servidorId: data.servidorId,
        updatedAt: data.updatedAt,
        Servidor: data.Servidor
      })

    })

    this.isCadastrarTurmaOpen = false
    this.turmaForm.reset()
    this.turmasTable.reset()
  }

  async editarTurmaDialog() {
    this.editarTurmaForm.reset({
      escola: this.escola.id,
      docente: this.turmaSelecionada.servidorId,
      letra: this.turmaSelecionada.letra,
      ano: this.turmaSelecionada.ano,
      anoLetivo: this.turmaSelecionada.anoLetivo
    })


    this.isEditarTurmaOpen = true
  }

  async editarTurma() {
    const escola = this.editarTurmaForm.get('escola').value
    const servidor = this.editarTurmaForm.get('docente').value
    const ano = this.editarTurmaForm.get('ano').value
    const anoLetivo = this.editarTurmaForm.get('anoLetivo').value
    const letra = this.editarTurmaForm.get('letra').value

    this.turmaService.editarTurma(
      this.turmaSelecionada.id,
      +escola,
      +servidor,
      ano,
      anoLetivo,
      letra
    ).then((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Turma editada com sucesso!',
      })

      let idx = this.turmas.findIndex((item) => item.id == data.id);
      this.turmas[idx] = {
        ano: data.ano,
        anoLetivo: data.anoLetivo,
        descricao: `${data.ano} ${data.letra} ${data.anoLetivo}`,
        createdAt: data.createdAt,
        deletedAt: data.deletedAt,
        escolaId: data.escolaId,
        Escola: { nome: (this.escolas.find((x: any) => x.id == data.escolaId).nome) },
        id: data.id,
        letra: data.letra,
        servidorId: data.servidorId,
        updatedAt: data.updatedAt,
        Servidor: data.Servidor
      };
    })

    this.editarTurmaForm.reset()
    this.turmasTable.reset()
    this.isEditarTurmaOpen = false
  }

  async detalhesTurma(turma: Turma) {
    this.turmaDetalhes = turma;
    this.detalheTurmaVisivel = true

    this.turmaDetalhesAlunos = await this.alunoService.getAlunosByTurmaId(turma.id)
  }
  
  async alunosDaTurmaDialog() {
    this.isAlunosDaTurmaDialog = true
  }

  async getAlunosDaTurma(turma: Turma){
    return  await this.alunoService.getAlunosByTurmaId(turma.id)
  }

  async rematricularDialog(){

    this.alunosTurma = await this.getAlunosDaTurma(this.turmaSelecionada)
    this.turmasRematriculas = this.turmas.filter(t => t.id !== this.turmaSelecionada.id)

    this.isRematricularDialogOpen = true
  }

  private async rematricular(){
    if(this.turmaSelecionada && this.turmaRematricula){
      try {
        const resposta = await this.turmaService.rematricular(this.turmaSelecionada.id, this.turmaRematricula.id)

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: resposta.message,
        })

      } catch(err) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: "Ocorreu um erro durante a rematrícula.",
        })

        console.error(err)
      }
    }

    this.resetRematriculaAction()
  }

  private resetRematriculaAction(){
    this.turmaSelecionada = null
    this.turmaRematricula = null

    this.isRematricularDialogOpen = false
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

  deletarTurma() {
    this.turmaService.deletarTurma(this.turmaSelecionada.id).then((data) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: data.data.message,
      })

      this.turmas = this.turmas.filter((x) => x.id != this.turmaSelecionada.id)
      this.turmaSelecionada = null;
    }).catch((err) => {
      if (err.response.data.resposta.data == 400) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: "Impossível de deletar, pois há alunos associados a esta turma.",
        })
      }
    })

    this.turmasTable.reset();
  }

  async onDocenteChange(e) {
    if (e.value) {
      this.docentesEscolaAdmin = await this.servidorService.buscarServidorPorNivelAcessoAndEscola(e.value, NivelAcessoEnum.DOCENTE.id)
    }
  }

  public abrirConfirmDialog() {
    this.confirmationService.confirm({
      key: 'reMatriculaDialog',
      message: '', 
      accept: () => {
        this.rematricular()
      },
      reject: () => {
        this.resetRematriculaAction()
      }
    });
  }
}
