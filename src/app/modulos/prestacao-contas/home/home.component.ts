import { Component, OnInit } from '@angular/core';
import { PDDEService } from '../services/pdde.service';
import { ContaBancariaService } from '../services/conta-bancaria.service';
import { PrestacaoContasService } from '../services/prestacao-contas.service';
import { Router } from '@angular/router';
import { PrestacaoContas } from '../model/prestacaoContas';
import { MessageService } from 'primeng/api';
import { PDDE } from '../model/PDDE';
import { MovimentacaoFinanceiraService } from '../services/movimentacao-financeira.service';
import { ContaBancaria } from '../model/contaBancaria';
import { Escola } from 'src/app/comum/model/escola';
import { jwtDecode } from 'jwt-decode';
import { ProgramaService } from '../services/programa.service';
import { NivelAcessoHandler } from '../services/nivel-acesso-handler.service';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';
import { EscolaService } from 'src/app/comum/services/escola.service';
export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

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
  dialogCadastrarConta: boolean = false;
  dialogCadastrarPrograma: boolean = false;
  anosDisponiveis: number[] = [];
  anoSelecionado: number;
  nivelAcessoId: number | null = null;
  NivelAcessoEnum = NivelAcessoEnum;

  escolaId: number; // Armazena o ID da escola obtido do token
  dialogCadastrarPDDE: boolean = false;

  programaData = {
    pddeId: 0,
    nome: '',
  };

  pddeData: any = {
    escolaId: null,
    contaBancariaId: null,
    tipo: '',
  };
  saldoData: any = {
    valor: 0,
    custeio: 0,
    capital: 0,
  };
  contasBancarias: any[] = [];

  constructor(
    private pddeService: PDDEService,
    private programaService: ProgramaService,
    private contaBancariaService: ContaBancariaService,
    private prestacaoContasService: PrestacaoContasService,
    private movimentacaoFinanceiraService: MovimentacaoFinanceiraService,
    private messageService: MessageService,
    private nivelAcesso: NivelAcessoHandler,
    private router: Router,
    private escolaService: EscolaService,
  ) {}

  novaConta = {
    escolaId: 1,
    agencia: '',
    numeroConta: '',
    banco: 'Banco do Brasil',
  };

  ngOnInit() {
    this.definirAnosDisponiveis();
    const anoSalvo = localStorage.getItem('anoFiscal');

    // Caso não exista no localStorage, define com o ano atual e salva
    if (anoSalvo) {
      this.anoSelecionado = parseInt(anoSalvo, 10); // Converte para número
    } else {
      const anoAtual = new Date().getFullYear(); // Obtém o ano atual
      this.anoSelecionado = anoAtual;
      localStorage.setItem('anoFiscal', anoAtual.toString()); // Salva no localStorage
      console.log('Ano fiscal inicializado com o ano atual e salvo no localStorage:', anoAtual);
    }

    this.extrairEscolaIdDoToken();
    this.loadPDDEs();
    this.loadContasBancarias();
    this.pddeData.escolaId = this.escolaId;
  }

  definirAnosDisponiveis() {
    const anoAtual = new Date().getFullYear();
    for (let ano = 2024; ano <= anoAtual + 1; ano++) {
      this.anosDisponiveis.push(ano);
    }
  }

  // Método para extrair o ID da escola do token JWT
  async extrairEscolaIdDoToken() {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      try {
        const decodedToken = JSON.parse(atob(tokenJWT.split('.')[1])); // Decodifica o token
        console.log('Decoded JWT:', decodedToken); // Para depuração
        const escolaId = decodedToken.servidor?.escolaId; // Extração do escolaId
        if (escolaId) {
          this.escolaId = escolaId;

          // Buscar informações da escola e armazenar no localStorage
          const escolaInfo = await this.escolaService.getById(escolaId);
          if (escolaInfo) {
            localStorage.setItem('escola', JSON.stringify(escolaInfo));
            console.log('Informações da escola armazenadas no localStorage:', escolaInfo);
          } else {
            console.error('Erro ao buscar as informações da escola.');
          }
        } else {
          console.error('escolaId não encontrado no token JWT.');
        }
      } catch (error) {
        console.error('Erro ao decodificar o token JWT:', error);
      }
    } else {
      console.error('Token JWT não encontrado ou inválido.');
    }
  }

  onAnoSelecionadoChange(ano: number) {
    this.anoSelecionado = ano;
    localStorage.setItem('anoFiscal', ano.toString());
    console.log('Ano fiscal salvo no localStorage:', ano);
  }

  async loadPDDEs() {
    try {
      const response = await this.pddeService.listarComSaldoPorEscola(this.escolaId);
      console.log('PDDEs carregados com saldo:', response);
      this.pddeList = response;
      this.loadContaBancariaInfo();
    } catch (error) {
      console.error('Erro ao carregar a lista de PDDEs:', error);
    }
  }

  // Função para carregar as informações de conta bancária para cada PDDE
  async loadContaBancariaInfo() {
    for (const pdde of this.pddeList) {
      if (pdde.contaBancariaId) {
        try {
          const contaBancaria = await this.contaBancariaService.listarIdContaBancaria(pdde.contaBancariaId);
          pdde.contaBancaria = contaBancaria;
        } catch (error) {
          console.error('Erro ao carregar a conta bancária:', error);
        }
      }
    }
  }

  async salvarContaBancaria() {
    if (!this.novaConta.agencia || !this.novaConta.numeroConta) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos!',
      });
      return;
    }
    try {
      await this.contaBancariaService.create(this.novaConta);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Conta cadastrada com sucesso!',
      });

      this.limparFormularioContaBancaria();
      this.dialogCadastrarConta = false;
      await this.loadContasBancarias();
    } catch (error) {
      console.error('Erro ao salvar a conta bancária:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.error?.error || 'Não foi possível salvar a conta bancária!',
      });
    }
  }

  limparFormularioPDDE() {
    this.pddeData = {
      escolaId: this.escolaId, // Mantém o ID da escola
      contaBancariaId: null,
      tipo: '',
    };

    this.saldoData = {
      valor: 0,
      custeio: 0,
      capital: 0,
    };
  }

  limparFormularioPrograma() {
    this.programaData = {
      pddeId: 0,
      nome: '',
    };
  }

  limparFormularioContaBancaria() {
    this.novaConta = {
      escolaId: this.escolaId, // Mantém o ID da escola
      agencia: '',
      numeroConta: '',
      banco: 'Banco do Brasil',
    };
  }

  async salvarPDDE() {
    const somaPercentual = this.saldoData.custeio + this.saldoData.capital;
    if (somaPercentual !== 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A soma dos valores de Custeio e Capital deve ser igual a 100%.',
      });
      return;
    }
    if (this.saldoData.valor < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O saldo não pode ser negativo. Por favor, insira um valor válido.',
      });
      return;
    }

    const pddeCompleto = {
      ...this.pddeData,
      contaBancariaId: Number(this.pddeData.contaBancariaId),
      saldo: { ...this.saldoData },
    };

    try {
      const respostaPDDE = await this.pddeService.cadastrarPdde(pddeCompleto);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'PDDE cadastrado com sucesso!',
      });

      // Cadastrar uma prestação de contas para o novo PDDE
      const createPrestacao: PrestacaoContas = {
        id: undefined,
        pDDEId: respostaPDDE.id,
        ano: new Date().getFullYear(),
        entregue: false,
        createdAt: undefined,
      };

      await this.prestacaoContasService.crete(createPrestacao);

      this.limparFormularioPDDE();
      this.dialogCadastrarPDDE = false;
      await this.loadPDDEs();
    } catch (error) {
      console.error('Erro ao cadastrar PDDE:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.error?.error || 'Erro ao cadastrar o PDDE. Tente novamente!',
      });
    }
  }

  async salvarPrograma() {
    this.programaData.pddeId = Number(this.programaData.pddeId);

    try {
      await this.programaService.create(this.programaData);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Programa cadastrado com sucesso!',
      });

      this.limparFormularioPrograma();
      this.dialogCadastrarPrograma = false;
    } catch (error) {
      const errorMessage = error.error?.error || 'Erro ao cadastrar o programa. Tente novamente.';
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
      console.error('Erro ao cadastrar programa:', error);
    }
  }

  async loadContasBancarias() {
    try {
      const response = await this.contaBancariaService.listarContasPorEscola(this.escolaId);
      this.contasBancarias = response;
      console.log('Contas bancárias carregadas:', this.contasBancarias); // Para depuração
    } catch (error) {
      console.error('Erro ao carregar contas bancárias:', error);
    }
  }

  verificarChecklist(pdde: PDDE) {
    this.selecionadoPDDE = pdde;
    console.log('Verificando checklist do PDDE ID:', this.selecionadoPDDE);
  }

  async navegarParaPesquisaPreco(pdde: PDDE) {
    let ano = this.anoSelecionado;
    const prestacaoContas = await this.prestacaoContasService.getByAnoPDDE(pdde.id, ano);

    if (prestacaoContas as PrestacaoContas) {
      localStorage.setItem('prestacaoContas', JSON.stringify(prestacaoContas));
      this.router.navigate([`/conta/listarpesquisa`]);
    } else {
      console.error('Não foi possível encontrar a prestação de contas para este ano');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível acessar a pesquisa',
      });
      this.dialogAcessar = false;
    }
  }

  navegarParaMovimentacoes(pdde: PDDE) {
    let ano = this.anoSelecionado;
    const contaBancaria = pdde.ContaBancaria;
    if (contaBancaria as ContaBancaria) {
      localStorage.setItem('contaBancaria', JSON.stringify(contaBancaria));
      localStorage.setItem('anoFiscal', JSON.stringify(ano));
      this.router.navigate([`/conta/movimentacoes`]);
    } else {
      console.error('Não foi possível encontrar a movimentacao financeira para este ano');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possivel acessar a pesquisa',
      });
      this.dialogAcessar = false;
    }
  }

  navegarParaAtas() {
    //1. Preciso saber o ano que estou visualizando
    let ano = this.anoSelecionado;
    console.log(this.pddeList[0]);

    const escola = this.pddeList[0].Escola;
    if (escola as Escola) {
      localStorage.setItem('escola', JSON.stringify(escola));
      localStorage.setItem('anoFiscal', JSON.stringify(ano));
      this.router.navigate([`/conta/atas`]);
    } else {
      console.error('Não foi possível encontrar a escola para este ano');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possivel acessar a pesquisa',
      });
      this.dialogAcessar = false;
    }
  }

  navegarParaOficios() {
    //1. Preciso saber o ano que estou visualizando
    let ano = this.anoSelecionado;

    const escola = this.pddeList[0].Escola;
    if (escola as Escola) {
      localStorage.setItem('escola', JSON.stringify(escola));
      localStorage.setItem('anoFiscal', JSON.stringify((ano = new Date().getFullYear())));
      this.router.navigate([`/conta/oficio-memorando`]);
    } else {
      console.error('Não foi possível encontrar escola para este ano');
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possivel acessar a pesquisa',
      });
      this.dialogAcessar = false;
    }

    // let ano: number = Number(new Date().getFullYear());
    // localStorage.setItem('escola', JSON.stringify(this.selecionadoPDDE.Escola));
    // localStorage.setItem('anoFiscal', JSON.stringify(ano));
    // this.router.navigate([`/conta/oficio-memorando`]);
  }

  createConta() {
    this.dialogCadastrarConta = true;
  }

  abrirCadastroPDDE() {
    this.dialogCadastrarPDDE = true;
  }

  abrirCadastroPrograma() {
    this.dialogCadastrarPrograma = true;
  }

  cancelarCadastroPDDE() {
    this.limparFormularioPDDE(); // Limpa o formulário de PDDE
    this.dialogCadastrarPDDE = false; // Fecha o modal de cadastro de PDDE
  }

  cancelarCadastroConta() {
    this.limparFormularioContaBancaria(); // Limpa o formulário de Conta Bancária
    this.dialogCadastrarConta = false; // Fecha o modal de cadastro de Conta Bancária
  }

  cancelarCadastroPrograma() {
    this.limparFormularioPrograma();
    this.dialogCadastrarPrograma = false;
  }

  permitirSomenteNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permite apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
