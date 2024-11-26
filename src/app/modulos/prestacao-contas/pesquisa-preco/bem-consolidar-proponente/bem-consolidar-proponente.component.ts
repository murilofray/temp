import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Fornecedor } from '../../model/fornecedor';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Masker } from 'mask-validation-br';
import { Bem } from '../../model/bem';
import { PropostaBem } from '../../model/propostaBem';
import { BemService } from '../../services/bem.service';
import { FornecedorService } from '../../services/fornecedor.service';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';

@Component({
  selector: 'app-bem-consolidar-proponente',
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
  templateUrl: './bem-consolidar-proponente.component.html',
  styleUrl: './bem-consolidar-proponente.component.scss',
})
export class BemConsolidarProponenteComponent {
  @ViewChildren('justificativaInput') justificativaInputs: QueryList<ElementRef>;

  constructor(
    private bemService: BemService,
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
  listaBens: any[] = [];
  bem: Bem = {
    id: undefined,
    pesquisaPrecoId: undefined,
    notaFiscalId: undefined,
    termoDoacaoId: undefined,
    descricao: undefined,
    menorValor: undefined,
    quantidade: undefined,
    justificativa: undefined,
    aprovado: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    PesquisaPreco: undefined,
    NotaFiscal: undefined,
    TermoDoacao: undefined,
    PropostaBem: undefined,
  };
  bensSelecionados: Bem[] = [];
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

  aprovarProponente(bem: any) {
    this.confirmationService.confirm({
      message: `Deseja aprovar o proponente <strong>"${bem.melhorFornecedor.razaoSocial}</strong> para o bem <strong>${bem.descricao}?</strong>`,
      header: 'Confirmação',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: async () => {
        bem.aprovado = true;
        bem.menorValor = bem.melhorValor;
        bem.melhorProponente = bem.melhorFornecedor.id;
        await this.bemService.update(bem);
      },
      reject: () => {},
    });
  }

  alterarProponente(bem: any) {
    this.bem = bem;
    this.idProponenteOriginalAlterar = bem.melhorFornecedor.id;
    this.dialogAlterarProponente = true;
    this.headerAlterarProponente = bem.descricao;
  }

  async submitAlterarProponente() {
    this.submitted = true;
    let hasError = false;

    this.campoJustificativa = this.campoJustificativa.trim();
    const propostaNova = this.bem.PropostaBem.find((pb: PropostaBem) => pb.fornecedorId === this.proponenteDoDropdown);

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
        this.bem.menorValor = propostaNova.valor;
        this.bem.aprovado = true;
        this.bem.melhorProponente = propostaNova.Fornecedor.id;
        await this.bemService.update(this.bem);
      },
      reject: () => {},
    });
    this.hideDialog();
    this.buscarTodos(this.pesquisaPreco.id);
  }

  isAprovarPesquisaPreco() {
    return !this.pesquisaPreco.consolidado && this.listaBens.every((b: Bem) => b.aprovado);
  }

  aprovarPesquisaPreco() {
    this.pesquisaPreco.consolidado = true;
    this.pesquisaPrecoService.update(this.pesquisaPreco);
  }

  valorProponente(bem: any, pos: number) {
    let existe: boolean = false;
    let valor: string = '';
    const fornecedor = this.listaProponentes[pos];
    const propostaBem =
      Array.isArray(bem.PropostaBem) && bem.PropostaBem.find((p: PropostaBem) => p.fornecedorId === fornecedor.id);
    if (propostaBem) {
      existe = true;
      valor = propostaBem.valor ? propostaBem.valor.toString() : '';
    }
    return { existe, valor };
  }

  /**
   * Recupera todos os bens e seus respectivos proponentes relacionados a uma pesquisa de preço específica.
   *
   * @param idPesquisa - O identificador único da pesquisa de preço.
   * @returns Uma promessa que resolve para um objeto contendo a lista de bens e seus proponentes.
   */
  private async buscarTodos(idPesquisa: number) {
    this.listaBens = await this.bemService.getByPesquisa(idPesquisa);
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
    for (const bem of this.listaBens) {
      if (!bem.melhorProponente) {
        const { menorValor, melhorFornecedor } = await this.menorPreco(bem);
        bem.melhorFornecedor = melhorFornecedor ? (melhorFornecedor as Fornecedor) : null;
        bem.melhorValor = menorValor;

        bem.showJustificativa = false;
        bem.justificativa = '';
      } else {
        bem.melhorValor = bem.menorValor;
        bem.melhorFornecedor = this.listaFornecedores.find((f) => f.id == bem.melhorProponente);
      }
    }
  }

  private menorPreco(bem: Bem) {
    if (!bem.PropostaBem || bem.PropostaBem.length === 0) {
      return { menorValor: null, melhorFornecedor: null };
    }
    let { menorValor, melhorFornecedor } = bem.PropostaBem.reduce(
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

  onProponenteChange(event: any, bem: any) {
    if (event.value !== bem.melhorFornecedor.id) {
      this.isCampoJustificativa = true;
    } else this.isCampoJustificativa = false;
    this.proponenteDoDropdown = event.value;
  }
}
