import { Component, OnInit } from '@angular/core';
import { PDDEService } from '../services/pdde.service';
import { SaldoPDDEService } from '../services/saldo-pdde.service';
import { ContaBancariaService } from '../services/conta-bancaria.service'; // Certifique-se de importar o serviço correto
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
    private contaBancariaService: ContaBancariaService, // Certifique-se de injetar o serviço de conta bancária
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadContasBancarias(); // Carregar as contas bancárias ao inicializar o componente
  }

  loadContasBancarias() {
    this.contaBancariaService.getAll().subscribe(
      (response) => {
        this.contasBancarias = response;
        console.log('Contas bancárias carregadas:', this.contasBancarias);
      },
      (error) => {
        console.error('Erro ao carregar contas bancárias:', error);
      },
    );
  }

  onSubmit() {
    // Converta o contaBancariaId para número antes de enviar ao backend
    this.pddeData.contaBancariaId = Number(this.pddeData.contaBancariaId);

    this.pddeService.cadastrarPdde(this.pddeData).subscribe(
      (response) => {
        const pddeId = response.id;
        this.saldoData.saldoPDDEId = pddeId;

        this.saldoPddeService.create(this.saldoData).subscribe(
          (saldoResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cadastro do PDDE e Saldo realizado com sucesso',
            });
            this.resetForm();
            this.displayModal = true;
          },
          (error) => {
            console.error('Erro ao cadastrar o Saldo PDDE:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao cadastrar o Saldo do PDDE',
            });
          },
        );
      },
      (error) => {
        console.error('Erro ao cadastrar o PDDE:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar o PDDE' });
      },
    );
  }

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

  navigateToPrograma() {
    this.displayModal = false;
    this.router.navigate(['conta/programa-cadastro']);
  }

  navigateToHome() {
    this.displayModal = false;
    this.router.navigate(['conta/home']);
  }
}
