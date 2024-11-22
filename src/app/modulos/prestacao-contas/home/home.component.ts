import { Component, OnInit } from '@angular/core';
import { PDDEService } from '../services/pdde.service';
import { ContaBancariaService } from '../services/conta-bancaria.service';
import { PrestacaoContasService } from '../services/prestacao-contas.service';
import { Router } from '@angular/router';
import { PrestacaoContas } from '../model/prestacaoContas';
import { MessageService } from 'primeng/api';
import { PDDE } from '../model/PDDE';
import { MovimentacaoFinanceiraService } from '../services/movimentacao-financeira.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private selecionadoPDDE: PDDE;
  pddeList: any[] = [];
  display: boolean = false;
  dialogAcessar: boolean = false;

  constructor(
    private pddeService: PDDEService,
    private contaBancariaService: ContaBancariaService,
    private prestacaoContasService: PrestacaoContasService,
    private movimentacaoFinanceiraService: MovimentacaoFinanceiraService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadPDDEs();
  }

  loadPDDEs() {
    this.pddeService.listarComSaldo().subscribe(
      (response) => {
        this.pddeList = response;
        this.loadContaBancariaInfo(); // Chama a função para carregar as informações de conta bancária
      },
      (error) => {
        console.error('Erro ao carregar a lista de PDDEs:', error);
      },
    );
  }

  // Função para carregar as informações de conta bancária para cada PDDE
  loadContaBancariaInfo() {
    this.pddeList.forEach((pdde) => {
      if (pdde.contaBancariaId) {
        this.contaBancariaService.listarIdContaBancaria(pdde.contaBancariaId).subscribe(
          (contaBancaria) => {
            pdde.contaBancaria = contaBancaria;
          },
          (error) => {
            console.error('Erro ao carregar a conta bancária:', error);
          },
        );
      }
    });
  }

  verificarChecklist(pdde: PDDE) {
    this.selecionadoPDDE = pdde;
    console.log('Verificando checklist do PDDE ID:', this.selecionadoPDDE);
  }

  selecionarConta(pdde: PDDE) {
    this.dialogAcessar = true;
    this.selecionadoPDDE = pdde;
    console.log('Selecionando conta do PDDE ID:', this.selecionadoPDDE);
  }

  async navegarParaPesquisaPreco() {
    //1. Preciso saber o ano que estou visualizando
    let ano: number;

    const prestacaoContas = await this.prestacaoContasService.getByAnoPDDE(this.selecionadoPDDE.id, ano);
    if (prestacaoContas as PrestacaoContas) {
      localStorage.setItem('prestacaoContas', JSON.stringify(prestacaoContas));
      this.router.navigate([`/conta/listarpesquisa`]);
    } else {
      console.error('Não foi possível encontrar a prestação de contas para este ano');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possivel acessar a pesquisa',
      });
      this.dialogAcessar = false;
    }
  }

  navegarParaMovimentacoes() {
    //1. Preciso saber o ano que estou visualizando
    let ano: number;

    localStorage.setItem('contaBancaria', JSON.stringify(this.selecionadoPDDE.ContaBancaria));
    localStorage.setItem('anoFiscal', JSON.stringify(ano));
    this.router.navigate([`/conta/movimentacoes`]);
  }

  navegarParaAtas() {
    // let ano: number;
    // localStorage.setItem('escola', JSON.stringify(this.selecionadoPDDE.escolaId));
    // localStorage.setItem('anoFiscal', JSON.stringify(ano));
    // this.router.navigate([`/conta/ata`]);
  }

  navegarParaOficios() {
    let ano: number = Number(new Date().getFullYear());
    localStorage.setItem('escola', JSON.stringify(this.selecionadoPDDE.Escola));
    localStorage.setItem('anoFiscal', JSON.stringify(ano));
    this.router.navigate([`/conta/oficio-memorando`]);
  }

  hideDialog() {
    this.dialogAcessar = false;
  }

  abrirSidebar() {
    this.display = true;
  }
}
