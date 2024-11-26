import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ServidorService } from '../services/servidor.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { NivelAcessoServidorService } from '../services/nivelAcessoServidor.service';
import { NivelAcessoService } from '../services/nivelAcesso.service';
import { Router } from '@angular/router';
import { EscolaService } from '../services/escola.service';
import { DropdownModule } from 'primeng/dropdown';

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
  diretor_temporario: boolean;
}

@Component({
  selector: 'app-cadastrar-servidor',
  standalone: true,
  imports: [
    ToastModule,
    InputTextModule,
    InputMaskModule,
    PasswordModule,
    CalendarModule,
    InputNumberModule,
    FormsModule,
    CommonModule,
    MultiSelectModule,
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './cadastrar-servidor.component.html',
  styleUrl: './cadastrar-servidor.component.scss',
})
export class CadastrarServidorComponent {
  constructor(
    private messageService: MessageService,
    private servidorService: ServidorService,
    private nivelAcessoServidorService: NivelAcessoServidorService,
    private nivelAcessoService: NivelAcessoService,
    private router: Router,
    private escolaService: EscolaService
  ) {}

  public niveisAcesso: any[];
  public today: Date = new Date();
  public escolas: any[] = [];

  ngOnInit(): void {
    // console.log('THE STRIPPER');
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
    this.carregarEscolas();
    
  }

  public newServidor: Servidor = {
    escolaId: null,
    nome: '',
    rg: '',
    cpf: '',
    dataContratacao: null,
    categoria: null,
    grau: null,
    pontuacaoAnual: null,
    pontuacaoAssiduidade: null,
    email: '',
    senha: '',
    createdAt: null,
    anoDaUltimaProgressaoPorAssiduidade: null,
    anoDaUltimaProgressaoPorTitulo: null,
    anoDoUltimoQuinquenio: null
  };

  // public niveisAcesso: NivelAcesso[] = [
  //   { id: 1, descricao: 'Administrador', diretor_temporario: false },
  //   { id: 2, descricao: 'Servidor', diretor_temporario: false },
  // ];

  public niveisSelecionados: NivelAcesso[] = [];

  public confirmarSenha: string = '';

  onSubmit() {
    if (this.newServidor.senha != this.confirmarSenha) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem' });
    }
    if (!this.validarCPF(this.newServidor.cpf)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'CPF Inválido' });
    } else {
      this.newServidor.createdAt = new Date();
      this.newServidor.cpf = this.removerPontosETraços(this.newServidor.cpf);
      this.newServidor.rg = this.removerPontosETraços(this.newServidor.rg);

      if(this.newServidor.anoDaUltimaProgressaoPorAssiduidade != null) this.newServidor.anoDaUltimaProgressaoPorAssiduidade = parseInt(this.newServidor.anoDaUltimaProgressaoPorAssiduidade.toString());
      if(this.newServidor.anoDaUltimaProgressaoPorTitulo != null) this.newServidor.anoDaUltimaProgressaoPorTitulo = parseInt(this.newServidor.anoDaUltimaProgressaoPorTitulo.toString());
      if(this.newServidor.anoDoUltimoQuinquenio != null) this.newServidor.anoDoUltimoQuinquenio = parseInt(this.newServidor.anoDoUltimoQuinquenio.toString());


      this.servidorService.cadastrarServidor(this.newServidor).subscribe(
        (servidorCadastrado) => {
          const niveisAcessoPayload = {
            servidorId: servidorCadastrado.id,
            niveisAcesso: this.niveisSelecionados.map((nivel) => nivel.id),
          };

          this.nivelAcessoServidorService.cadastrarNivelAcesso(niveisAcessoPayload).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Servidor e níveis de acesso cadastrados com sucesso!',
              });
            },
            (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao cadastrar níveis de acesso!',
              });
            },
          );

          this.newServidor = {
            escolaId: null,
            nome: '',
            rg: '',
            cpf: '',
            dataContratacao: null,
            categoria: null,
            grau: null,
            pontuacaoAnual: null,
            pontuacaoAssiduidade: null,
            email: '',
            senha: '',
            createdAt: null,
            anoDaUltimaProgressaoPorAssiduidade: null,
            anoDaUltimaProgressaoPorTitulo: null,
            anoDoUltimoQuinquenio: null
          };

          this.niveisSelecionados = [];

          // this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Servidor cadastrado com sucesso!' });
          // console.log(this.newServidor);
        },
        (error) => {
          console.log(error);
          if (error.status === 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Já existe um servidor cadastrado com o mesmo CPF!',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao cadastrar servidor!',
            });
          }
        },
      );
    }
  }

  isInvalid() {
    if (
      this.newServidor.escolaId == null ||
      this.newServidor.nome == '' ||
      this.newServidor.rg == '' ||
      this.newServidor.cpf == '' ||
      this.newServidor.dataContratacao == null ||
      this.newServidor.email == '' ||
      this.newServidor.senha == '' ||
      this.confirmarSenha == '' ||
      this.niveisSelecionados.length == 0
    ) {
      return true;
    }
    return false;
  }

  removerPontosETraços(texto: string): string {
    return texto.replace(/[.-]/g, '');
  }

  onNiveisChange() {
    console.log(this.niveisSelecionados);
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
    const calcularDigito = (cpf: string, fator: number) => {
      let total = 0;
      for (let i = 0; i < fator - 1; i++) {
        total += parseInt(cpf.charAt(i)) * (fator - i);
      }
      const resto = total % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const digito1 = calcularDigito(cpf, 10);

    const digito2 = calcularDigito(cpf, 11);

    return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
  }

  navigateToListaServidores() {
    this.router.navigate(['comum/lista-servidores']);
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

}
