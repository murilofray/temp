import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TurmaService } from '../services/turma/turma.service';
import { RelatorioService } from '../services/relatorio/relatorio.service';
import { TurmaRelatorio } from '../model/turmaRelatorio';
import { JwtPayload } from '../model/jwtPayload';
import { Escola } from '../model/escola';
import { Servidor } from '../model/servidor';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { jwtDecode } from 'jwt-decode';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { EscolaService } from '../../../comum/services/escola.service';
import { Turma } from '../model/turma';
import { UserInfoService } from 'src/app/utils/services/user.service';

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
  providers: [ConfirmationService, MessageService],
  templateUrl: './gerenciar-relatorios.component.html',
  styleUrls: ['./gerenciar-relatorios.component.scss']
})
export class GerenciarRelatoriosComponent {
  public niveis = NivelAcessoEnum;

  public relatorioBeneficiariosDialogVisivel: boolean = false;
  public relatorioMeninosMeninasDialogVisivel: boolean = false;

  public turmas: Turma[] = [];
  public turmasRelatorio: TurmaRelatorio[] = [];
  public turmaRelatorio: TurmaRelatorio;

  public escolas: Escola[] = [];

  public escola: Escola;
  public servidor: Servidor;

  public docentesEscola: Servidor[] = [];

  public user;

  public isLoading: boolean = false;

  constructor(
    private turmaService: TurmaService,
    private relatorioService: RelatorioService,
    private messageService: MessageService,
    private servidorService: ServidorService,
    private escolaService: EscolaService,
    public userService: UserInfoService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.escolaService.getEscolas().then((data) => {
      this.escolas = data;

      this.getUserInfo();
      this.isLoading = false;
    });
  }

  async getUserInfo(){
    try {
      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        const decodedToken: JwtPayload = jwtDecode(tokenJWT);
        const jwtServidor = decodedToken['servidor'];
        this.user = jwtServidor;
        const servidorId = jwtServidor.id;

        let servidor = await this.servidorService.buscarServidorPorId(servidorId);
        this.servidor = servidor;

        this.escola = this.escolas.find(x => x.id == this.servidor.Escola.id);

        this.turmaService.getTurmaByEscola(this.escola.id).then((data) => {
          this.turmas = data;
          this.preencherTurmasRelatorio();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  preencherTurmasRelatorio() {
    this.turmasRelatorio = [
        { id: -1, descricao: 'Todas' },
        ...this.turmas.map(turma => ({
            id: turma.id,
            descricao: `${turma.ano} ${turma.letra}` // Concatena ano e letra para formar a descrição
        }))
    ];
}

  async downloadRelatorioBeneficiarios() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.downloadRelatorioBeneficiarios(this.turmaRelatorio.id, this.user.escolaId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma turma selecionada para o relatório.',
      });
    }
  }

  async imprimirRelatorioBeneficiarios() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.printRelatorioBeneficiarios(this.turmaRelatorio.id, this.user.escolaId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma turma selecionada para o relatório.',
      });
    }
  }

  async downloadRelatorioMeninosMeninas() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.downloadRelatorioMeninosMeninas(this.turmaRelatorio.id, this.user.escolaId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma turma selecionada para o relatório.',
      });
    }
  }

  async imprimirRelatorioMeninosMeninas() {
    if (this.turmaRelatorio?.id) {
      await this.relatorioService.printRelatorioMeninosMeninas(this.turmaRelatorio.id, this.user.escolaId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma turma selecionada para o relatório.',
      });
    }
  }

  async downloadRelatorioBairros() {
      await this.relatorioService.downloadRelatorioBairros(this.user.escolaId);
  }

  async downloadRelatorioDistribuicaoRacial(){
      await this.relatorioService.downloadRelatorioDistribuicaoRacialAlunos(this.user.escolaId)
  }

  async downloadRelatorioDistribuicaoRacialAdmin(){
    await this.relatorioService.downloadRelatorioDistribuicaoRacialAlunosParaAdmin()
  }
  
  async downloadRelatorioBairrosAdmin(){
    await this.relatorioService.downloadRelatorioBairrosParaAdmin();
  }

  async downloadRelatorioMeninosEMeninasAdmin(){
    await this.relatorioService.downloadRelatorioMeninosEMeninasParaAdmin();
  }

  async downloadRelatorioBeneficiariosAdmin(){
    await this.relatorioService.downloadRelatorioBeneficiariosParaAdmin();
  }
}
