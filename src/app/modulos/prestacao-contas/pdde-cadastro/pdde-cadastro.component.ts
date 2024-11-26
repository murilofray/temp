import { Component, OnInit } from '@angular/core';
import { PDDEService } from '../services/pdde.service';
import { SaldoPDDEService } from '../services/saldo-pdde.service';
import { ContaBancariaService } from '../services/conta-bancaria.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdde-cadastro',
  templateUrl: './pdde-cadastro.component.html',
  styleUrls: ['./pdde-cadastro.component.css'],
})
export class PddeCadastroComponent implements OnInit {
  pddeData = {
    escolaId: null,
    contaBancariaId: 0,
    tipo: '',
  };

  saldoData = {
    saldoPDDEId: null,
    valor: null,
    custeio: null,
    capital: null,
  };

  contasBancarias: any[] = [];
  displayModal: boolean = false;

  constructor(
    private pddeService: PDDEService,
    private saldoPddeService: SaldoPDDEService,
    private contaBancariaService: ContaBancariaService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadContasBancarias(); // Carregar as contas bancárias ao inicializar o componente
  }

  // Método para carregar contas bancárias usando async/await
  async loadContasBancarias() {
    try {
      const response = await this.contaBancariaService.getAll();
      this.contasBancarias = response;
      console.log('Contas bancárias carregadas:', this.contasBancarias);
    } catch (error) {
      console.error('Erro ao carregar contas bancárias:', error);
    }
  }

  // Método para salvar o PDDE e o saldo associado
  async onSubmit() {
    try {
      // Converte o contaBancariaId para número
      this.pddeData.contaBancariaId = Number(this.pddeData.contaBancariaId);

      // Cadastra o PDDE
      const pddeResponse = await this.pddeService.cadastrarPdde(this.pddeData);
      const pddeId = pddeResponse.id;
      this.saldoData.saldoPDDEId = pddeId;

      // Cadastra o saldo associado ao PDDE
      await this.saldoPddeService.create(this.saldoData);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cadastro do PDDE e Saldo realizado com sucesso',
      });

      this.resetForm();
      this.displayModal = true;
    } catch (error) {
      console.error('Erro ao cadastrar PDDE ou Saldo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar o PDDE ou o Saldo',
      });
    }
  }

  // Método para resetar os formulários
  resetForm() {
    this.pddeData = {
      escolaId: null,
      contaBancariaId: 0,
      tipo: '',
    };

    this.saldoData = {
      saldoPDDEId: null,
      valor: null,
      custeio: null,
      capital: null,
    };
  }

  // Método para navegar para a tela de cadastro de Programa
  navigateToPrograma() {
    this.displayModal = false;
    this.router.navigate(['conta/programa-cadastro']);
  }

  // Método para navegar para a tela inicial
  navigateToHome() {
    this.displayModal = false;
    this.router.navigate(['conta/home']);
  }
}
