import { CommonModule } from '@angular/common';
import { Component, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Masker } from 'mask-validation-br';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Fornecedor } from '../../model/fornecedor';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { PropostaServico } from '../../model/propostaServico';
import { Servico } from '../../model/servico';
import { FornecedorService } from '../../services/fornecedor.service';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';
import { ServicoService } from '../../services/servico.service';

@Component({
  selector: 'app-servico-consolidar-proponente',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    ToolbarModule,
    ToastModule,
    TooltipModule,
    InputTextareaModule,
  ],
  templateUrl: './servico-consolidar-proponente.component.html',
  styleUrl: './servico-consolidar-proponente.component.scss',
})
export class ServicoConsolidarProponenteComponent {
  @ViewChildren('justificativaInput') justificativaInputs: QueryList<ElementRef>;

  constructor(
    private servicoService: ServicoService,
    private fornecedorService: FornecedorService,
    private pesquisaPrecoService: PesquisaPrecoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  proponentesDropdown: { value: number; proponente: string }[] = [];
  proponenteSelecionadoDropdown: any;
  private proponenteDoDropdown: number;
  private idProponenteOriginalAlterar: number;
  headerAlterarProponente = '';
  isCampoJustificativa: boolean = false;
  campoJustificativa: string = '';
  tituloPesquisa = '';
  private pesquisaPreco: PesquisaPreco;
  listaServicos: any[] = [];
  servico: Servico = {
    id: undefined,
    pesquisaPrecoId: undefined,
    notaFiscalId: undefined,
    descricao: undefined,
    menorValor: undefined,
    justificativa: undefined,
    aprovado: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    PesquisaPreco: undefined,
    NotaFiscal: undefined,
    PropostaServico: undefined,
  };
  servicosSelecionados: Servico[] = [];
  dialogAlterarProponente: boolean = false;

  private listaFornecedores: Fornecedor[] = [];
  listaProponentes: Fornecedor[] = [];
  proponente: Fornecedor = {
    id: undefined,
    cnpj: undefined,
    cpf: undefined,
    cidade: undefined,
    endereco: undefined,
    responsavel: undefined,
    nomeFantasia: undefined,
    telefone: undefined,
    email: undefined,
    razaoSocial: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  };

  submitted: boolean = false;

  async ngOnInit() {
    const dataPesquisa = localStorage.getItem('pesquisaPreco');

    if (dataPesquisa) {
      this.pesquisaPreco = await this.pesquisaPrecoService.getById(Number(JSON.parse(dataPesquisa).id));
      await this.buscarTodos(this.pesquisaPreco.id);
      const programa = this.pesquisaPreco.Programa ? `${this.pesquisaPreco.Programa.nome}: ` : '';
      const titulo = this.pesquisaPreco.titulo ? this.pesquisaPreco.titulo : '';
      this.tituloPesquisa = programa + titulo;
    } else {
      this.router.navigate(['/notfound']);
    }
  }

  aprovarProponente(servico: any) {
    this.confirmationService.confirm({
      message: `Deseja aprovar o proponente <strong>"${servico.melhorFornecedor.razaoSocial}</strong> para o servico <strong>${servico.descricao}?</strong>`,
      header: 'Confirmação',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: async () => {
        servico.aprovado = true;
        servico.menorValor = servico.melhorValor;
        servico.melhorProponente = servico.melhorFornecedor.id;
        await this.servicoService.update(servico);
      },
      reject: () => {},
    });
  }

  alterarProponente(servico: any) {
    this.servico = servico;
    this.idProponenteOriginalAlterar = servico.melhorFornecedor.id;
    this.dialogAlterarProponente = true;
    this.headerAlterarProponente = servico.descricao;
  }

  async submitAlterarProponente() {
    this.submitted = true;
    let hasError = false;

    this.campoJustificativa = this.campoJustificativa.trim();
    const propostaNova = this.servico.PropostaServico.find(
      (pb: PropostaServico) => pb.fornecedorId === this.proponenteDoDropdown,
    );

    if (this.isCampoJustificativa && !this.campoJustificativa) {
      this.mensagemErroCampo('uma Justificativa');
      hasError = true;
    }

    if (!this.proponenteSelecionadoDropdown) {
      this.mensagemErroCampo('um novo Proponente');
      hasError = true;
    }

    if (this.proponenteSelecionadoDropdown === this.idProponenteOriginalAlterar) {
      this.mensagemErroCampo('um Proponente diferente do atual e');
      hasError = true;
    }

    if (hasError) return;

    this.confirmationService.confirm({
      message: `Deseja alterar o proponente <strong>${this.listaFornecedores.find((f: Fornecedor) => f.id == this.idProponenteOriginalAlterar).razaoSocial}</strong> para o proponente <strong>${propostaNova.Fornecedor.razaoSocial}</strong> e o <strong>APROVAR?</strong>`,
      header: 'Confirmação',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: async () => {
        this.servico.menorValor = propostaNova.valor;
        this.servico.aprovado = true;
        this.servico.melhorProponente = propostaNova.Fornecedor.id;
        await this.servicoService.update(this.servico);
      },
      reject: () => {},
    });
    this.hideDialog();
    this.buscarTodos(this.pesquisaPreco.id);
  }

  isAprovarPesquisaPreco() {
    return !this.pesquisaPreco.consolidado && this.listaServicos.every((b: Servico) => b.aprovado);
  }

  aprovarPesquisaPreco() {
    this.pesquisaPreco.consolidado = true;
    this.pesquisaPrecoService.update(this.pesquisaPreco);
  }

  valorProponente(servico: any, pos: number) {
    let existe: boolean = false;
    let valor: string = '';
    const fornecedor = this.listaProponentes[pos];
    const propostaServico =
      Array.isArray(servico.PropostaServico) &&
      servico.PropostaServico.find((p: PropostaServico) => p.fornecedorId === fornecedor.id);
    if (propostaServico) {
      existe = true;
      valor = propostaServico.valor ? propostaServico.valor.toString() : '';
    }
    return { existe, valor };
  }

  /**
   * Recupera todos os servicos e seus respectivos proponentes relacionados a uma pesquisa de preço específica.
   *
   * @param idPesquisa - O identificador único da pesquisa de preço.
   * @returns Uma promessa que resolve para um objeto contendo a lista de servicos e seus proponentes.
   */
  private async buscarTodos(idPesquisa: number) {
    this.listaServicos = await this.servicoService.getByPesquisa(idPesquisa);
    this.listaFornecedores = await this.fornecedorService.getByPesquisa(idPesquisa);
    await this.construirListaProponentes();
    await this.coletarProponentes();
    await this.melhorProponente();
    this.cdr.detectChanges();
  }

  private async construirListaProponentes() {
    if (!this.listaFornecedores || !this.pesquisaPreco) {
      throw new Error('Lista de fornecedores ou pesquisa de preço não definida.');
    } else {
      const proponentesIds = [
        this.pesquisaPreco.proponenteA,
        this.pesquisaPreco.proponenteB,
        this.pesquisaPreco.proponenteC,
      ];
      this.listaProponentes = proponentesIds.map((id) => this.listaFornecedores.find((f) => f.id === id));
    }
  }

  private async coletarProponentes() {
    if (this.pesquisaPreco) {
      this.proponentesDropdown = this.listaFornecedores.map((fornecedor: Fornecedor) => ({
        value: fornecedor.id,
        proponente: fornecedor.razaoSocial,
      }));
    }
  }

  private async melhorProponente() {
    for (const servico of this.listaServicos) {
      if (!servico.melhorProponente) {
        const { menorValor, melhorFornecedor } = await this.menorPreco(servico);
        servico.melhorFornecedor = melhorFornecedor ? (melhorFornecedor as Fornecedor) : null;
        servico.melhorValor = menorValor;

        servico.showJustificativa = false;
        servico.justificativa = '';
      } else {
        servico.melhorValor = servico.menorValor;
        servico.melhorFornecedor = this.listaFornecedores.find((f) => f.id == servico.melhorProponente);
      }
    }
  }

  private menorPreco(servico: Servico) {
    if (!servico.PropostaServico || servico.PropostaServico.length === 0) {
      return { menorValor: null, melhorFornecedor: null };
    }
    let { menorValor, melhorFornecedor } = servico.PropostaServico.reduce(
      (acc, proposta) => {
        const valorProposta = Number(proposta.valor);
        if (valorProposta < acc.menorValor) {
          acc.menorValor = valorProposta;
          acc.melhorFornecedor = this.listaFornecedores.find((f: Fornecedor) => f.id === proposta.fornecedorId);
        }
        return acc;
      },
      { menorValor: Infinity, melhorFornecedor: null },
    );
    return { menorValor, melhorFornecedor };
  }

  private verificarExisteFornecedor(pos: number) {
    // Verifique se a posição é válida e se a lista existe
    if (this.listaProponentes && this.listaProponentes.length > pos) {
      const fornecedor = this.listaProponentes[pos];
      const existe = fornecedor && fornecedor.id !== -1;
      return existe;
    } else {
      return false;
    }
  }

  /**
   * Recupera o nome, documento e o status de existência do proponente na posição fornecida.
   *
   * @param pos - A posição do proponente na lista.
   * @returns Um objeto contendo o nome, documento e o status de existência do proponente.
   * @returns {nome: string, doc: string, existe: boolean} - O nome, documento e o status de existência do proponente.
   */
  proponentesTopo(pos: number) {
    // Verifique se a posição é válida e se a lista existe
    const existe = this.verificarExisteFornecedor(pos);
    if (existe) {
      const fornecedor = this.listaProponentes[pos];
      const nome = fornecedor.razaoSocial || ''; // Nome padrão
      const doc = this.formatarDocumentoFornecedor(fornecedor);
      return { nome, doc, existe, fornecedor };
    } else {
      // Se a posição é inválida, retorne um objeto padrão
      return { nome: '', doc: '', existe: false };
    }
  }

  private formatarDocumentoFornecedor(fornecedor: Fornecedor): string {
    if (fornecedor.cnpj && fornecedor.cnpj.trim()) return `CNPJ: ${Masker.cnpj(fornecedor.cnpj)}`;
    else if (fornecedor.cpf && fornecedor.cpf.trim()) return `CPF: ${Masker.cpf(fornecedor.cpf)}`;
    else return '';
  }

  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }

  navigateTo() {
    this.router.navigate(['conta/consolidar/B']);
  }

  navigateToPesquisa() {
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaPreco));
    this.router.navigate([`conta/pesquisa/${this.pesquisaPreco.tipo}`]);
  }

  hideDialog() {
    this.dialogAlterarProponente = false;
    this.isCampoJustificativa = false;
    this.headerAlterarProponente = '';
    this.campoJustificativa = '';
    this.idProponenteOriginalAlterar = undefined;
    this.submitted = false;
  }

  onProponenteChange(event: any, servico: any) {
    if (event.value !== servico.melhorFornecedor.id) {
      this.isCampoJustificativa = true;
    } else this.isCampoJustificativa = false;
    this.proponenteDoDropdown = event.value;
  }
}
