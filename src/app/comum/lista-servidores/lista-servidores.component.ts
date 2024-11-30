import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServidorService } from '../services/servidor.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber'
import { EscolaService } from '../services/escola.service';
import { NivelAcessoServidorService } from '../services/nivelAcessoServidor.service';
import { NivelAcessoService } from '../services/nivelAcesso.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { jwtDecode } from 'jwt-decode';

interface Escola {
  id: number;
  apmId?: number;
  imagensId?: number;
  nome: string;
  cnpj: string;
  inep: string;
  atoCriacao: string;
  endereco: string;
  email: string;
}

interface Servidor {
  escolaId: number;
  nome: string;
  rg: string;
  cpf: string;
  dataContratacao: Date;
  categoria: string;
  grau: string;
  pontuacaoAnual: number;
  pontuacaoAssiduidade: number;
  email: string;
  senha: string;
  createdAt: Date;
  anoDaUltimaProgressaoPorAssiduidade : number;
  anoDaUltimaProgressaoPorTitulo : number;
  anoDoUltimoQuinquenio : number;
}

interface NivelAcesso {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-lista-servidores',
  standalone: true,
  imports: [MultiSelectModule, 
            ToolbarModule, 
            TableModule, 
            CommonModule, 
            ButtonModule, 
            DialogModule, 
            InputTextModule, 
            FormsModule, 
            InputMaskModule, 
            CalendarModule, 
            InputNumberModule, 
            DropdownModule, 
            ReactiveFormsModule,
            ToastModule
          ],
  providers: [MessageService],
  templateUrl: './lista-servidores.component.html',
  styleUrl: './lista-servidores.component.scss'
})
export class ListaServidoresComponent {

  constructor(
    private router: Router,
    private servidorService: ServidorService,
    private messageService: MessageService,
    private escolaService: EscolaService,
    private nivelAcessoServidorService: NivelAcessoServidorService,
    private nivelAcessoService: NivelAcessoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.buscarServidores();
    this.carregarEscolas();

    this.nivelAcessoService.getAll().subscribe(
      (data) => {
        this.niveisAcesso = data;
        this.niveisAcesso.forEach((nivelAcesso) => {
          if (nivelAcesso.id == 7) {
            //remover
            this.niveisAcesso.splice(this.niveisAcesso.indexOf(nivelAcesso), 1);
          }
        })
        // console.log('DADOS: ', this.niveisAcesso);
      },
      (error) => {
        console.error('Erro ao buscar os níveis de acesso:', error);
      },
    );
    

  }

  public servidores: any[] = [];
  public servidoresFiltrados: any[] = [];

  public visualizarServidorDialog: boolean = false;
  public servidorSelecionado: any | null = null;

  public editarServidorDialog: boolean = false;

  public niveisAcesso: NivelAcesso[];
  public escolas: any[] = [];
  public niveisSelecionados: NivelAcesso[] = [];

  public confirmacaoExclusaoDialog: boolean = false;
  public servidorParaExcluir: number | null = null;


  public navigateToCadastroServidor() {
    this.router.navigate(['comum/cadastrar-servidor']);
  }

  public censurarCpf(cpf: string) {
    const censoredCpf = cpf.slice(0, 3) + cpf.slice(3, -2).replace(/./g, '*') + cpf.slice(-2);
    return censoredCpf;
  }

  async buscarServidores() {
    const resultado = await this.servidorService.buscarServidoresExcetoAPM();

    if (resultado.success) {
      this.servidores = resultado.data;

      // this.servidores.forEach(servidor => {
      //   servidor.cpf = this.censurarCpf(servidor.cpf);
      // })
      this.servidoresFiltrados = [...this.servidores];
    } else {
      console.error(resultado.message);
    } 
  }

  filtrarServidores(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();

    this.servidoresFiltrados = this.servidores.filter(servidor =>
      servidor.nome.toLowerCase().includes(valor) ||
      servidor.cpf.toLowerCase().includes(valor) ||
      servidor.Escola?.nome?.toLowerCase().includes(valor) ||
      servidor.categoria?.toLowerCase().includes(valor) ||
      servidor.grau?.toLowerCase().includes(valor) ||
      servidor.anoDaUltimaProgressaoPorAssiduidade?.toString().includes(valor) ||
      servidor.anoDaUltimaProgressaoPorTitulo?.toString().includes(valor) ||
      servidor.anoDoUltimoQuinquenio?.toString().includes(valor)
    );
  }

  public visualizarServidor(servidor: Servidor): void {
    this.servidorSelecionado = servidor;
    this.visualizarServidorDialog = true;
  }

  public abrirEditarServidorDialog(servidor: any): void {

    this.servidorSelecionado = {
      ...servidor,
      dataContratacao: servidor.dataContratacao ? new Date(servidor.dataContratacao) : null,
    };
    this.niveisSelecionados = servidor.NivelAcessoServidor.map(nivel => nivel.Acesso);

    this.editarServidorDialog = true;

  }

  public abrirConfirmacaoExclusao(servidorId: number): void {
    this.servidorParaExcluir = servidorId;
    this.confirmacaoExclusaoDialog = true;
  }

  isInvalid(): boolean {
    return (
      !this.servidorSelecionado.nome ||
      !this.servidorSelecionado.email ||
      !this.servidorSelecionado.rg ||
      !this.servidorSelecionado.dataContratacao ||
      !this.niveisSelecionados ||
      this.niveisSelecionados.length === 0
    );
  }

  onEditSubmit() {
    if (this.isInvalid()) {
      console.error('Preencha todos os campos obrigatórios');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios antes de salvar.',
      });
      return;
    }
  
    // Extrair os IDs dos níveis de acesso
    const niveisAcessoIds: number[] = [];
    this.niveisSelecionados.forEach((nivel: any) => {
      if (nivel.id) {
        niveisAcessoIds.push(nivel.id);
      }
    });

    if(this.servidorSelecionado.anoDaUltimaProgressaoPorAssiduidade != null) this.servidorSelecionado.anoDaUltimaProgressaoPorAssiduidade = parseInt(this.servidorSelecionado.anoDaUltimaProgressaoPorAssiduidade.toString());
    if(this.servidorSelecionado.anoDaUltimaProgressaoPorTitulo != null) this.servidorSelecionado.anoDaUltimaProgressaoPorTitulo = parseInt(this.servidorSelecionado.anoDaUltimaProgressaoPorTitulo.toString());
    if(this.servidorSelecionado.anoDoUltimoQuinquenio != null) this.servidorSelecionado.anoDoUltimoQuinquenio = parseInt(this.servidorSelecionado.anoDoUltimoQuinquenio.toString());
  

    const servidorAtualizado: Servidor = { ...this.servidorSelecionado };
    const servidorId = this.servidorSelecionado.id; 

  
    // console.log('Enviando servidor atualizado:', servidorAtualizado);
    // console.log('Níveis de acesso selecionados (IDs):', niveisAcessoIds);
  

    this.servidorService
      .atualizarServidorComNiveisAcesso(servidorId, servidorAtualizado, niveisAcessoIds)
      .then((response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Servidor atualizado com sucesso!',
          });
          this.editarServidorDialog = false;
          this.ngOnInit();
        } else {
          const detail = response.message.includes('email')
          ? 'O e-mail fornecido já está em uso. Por favor, utilize outro.'
          : response.message;

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: detail,
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao atualizar servidor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao atualizar o servidor.',
        });
      });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  async carregarEscolas() {
    try {
      this.escolas = await this.escolaService.getEscolas();
    } catch (error) {
      console.error('Erro ao carregar escolas: ', error);
    }
  }

  public async confirmarExclusao(): Promise<void> {
    if (this.servidorParaExcluir !== null) {

      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        const decodedToken: any = jwtDecode(tokenJWT);
        const servidorLogadoId = decodedToken.servidor.id;

        if (this.servidorParaExcluir === servidorLogadoId) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não é possível excluir você mesmo!',
          });
          return;
        }
  
      }
      else{
        return
      }

      try {
        const resultado = await this.servidorService.deletarServidor(this.servidorParaExcluir);
        if (resultado.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Servidor deletado com sucesso!',
          });
          this.confirmacaoExclusaoDialog = false;
          this.servidorParaExcluir = null;
          await this.buscarServidores();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: resultado.message,
          });
        }
      } catch (error) {
        console.error('Erro ao deletar servidor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao tentar deletar o servidor.',
        });
      } finally {
        this.confirmacaoExclusaoDialog = false;
        this.servidorParaExcluir = null;
      }
    }
  }

  public cancelarExclusao(): void {
    this.confirmacaoExclusaoDialog = false;
    this.servidorParaExcluir = null;
  }

}
