import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MembroApmService } from '../services/membroAPMService';
import { EscolaService } from '../../../comum/services/escola.service';
import { DropdownModule } from 'primeng/dropdown';
import { ApmService } from '../services/apmService';

interface MembroAPM {
  apmId: null,
  nome: string;
  rg: string;
  cpf: string;
  dataContratacao: Date;
  email: string;
  senha: string;
  cargoAPMId: number
}

interface CargoAPM {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-cadastrar-usuario-apm',
  standalone: true,
  imports: [
    ToastModule,
    InputTextModule,
    InputMaskModule,
    PasswordModule,
    CalendarModule,
    FormsModule,
    CommonModule,
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './cadastrar-usuario-apm.component.html',
  styleUrl: './cadastrar-usuario-apm.component.scss'
})
export class CadastrarUsuarioApmComponent {

  constructor(
    private messageService: MessageService,
    private membroApmService: MembroApmService,
    private escolaService: EscolaService,
    private apmService: ApmService
  ) {}

  public today: Date = new Date();
  public escolas: any[] = [];
  public confirmarSenha: string = '';
  public apms: any[] = [];

  public cargos: CargoAPM[] = [
    { id: 1, descricao: 'Presidente' },
    { id: 2, descricao: 'Diretor Executivo' },
    { id: 3, descricao: 'Diretor Financeiro' },
    { id: 4, descricao: 'Conselheiro Fiscal' },
  ];

  public newMembroAPM: MembroAPM = {
    cargoAPMId: null,
    apmId: null,
    nome: '',
    rg: '',
    cpf: '',
    dataContratacao: null,
    email: '',
    senha: '',
  };

  ngOnInit(): void {
    // this.apmService.getAll().subscribe((apms) => {
    //   this.apms = apms;
    // })

    this.carregarEscolas();
  }

  onSubmit() {
    if (this.newMembroAPM.senha !== this.confirmarSenha) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem' });
      return;
    }

    if (!this.validarCPF(this.newMembroAPM.cpf)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'CPF Inválido' });
      return;
    }

    this.newMembroAPM.cpf = this.removerPontosETraços(this.newMembroAPM.cpf);
    this.newMembroAPM.rg = this.removerPontosETraços(this.newMembroAPM.rg);

    this.membroApmService.cadastrarMembroAPM(this.newMembroAPM).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Membro da APM cadastrado com sucesso!',
        });
        this.resetForm();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro ao cadastrar membro da APM!',
        });
      }
    );
  }

  isInvalid() {
    const {cargoAPMId, apmId ,nome, rg, cpf, dataContratacao, email, senha } = this.newMembroAPM;
    return !(cargoAPMId && apmId && nome && rg && cpf && dataContratacao && email && senha && this.confirmarSenha);
  }

  removerPontosETraços(texto: string): string {
    return texto.replace(/[.-]/g, '');
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calcularDigito = (cpf: string, fator: number) => {
      let total = 0;
      for (let i = 0; i < fator - 1; i++) total += parseInt(cpf.charAt(i)) * (fator - i);
      const resto = total % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const digito1 = calcularDigito(cpf, 10);
    const digito2 = calcularDigito(cpf, 11);

    return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
  }

  async carregarEscolas() {
    try {
      this.escolas = await this.escolaService.getEscolas();
    } catch (error) {
      console.error('Erro ao carregar escolas: ', error);
    }
  }

  resetForm() {
    this.newMembroAPM = {
      cargoAPMId: null,
      apmId: null,
      nome: '',
      rg: '',
      cpf: '',
      dataContratacao: null,
      email: '',
      senha: '',
    };
    this.confirmarSenha = '';
  }

  formatDateLabel = (apm: any): string => {
    if (!apm || !apm.dataFormacao) return '';
    const date = new Date(apm.dataFormacao);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}
