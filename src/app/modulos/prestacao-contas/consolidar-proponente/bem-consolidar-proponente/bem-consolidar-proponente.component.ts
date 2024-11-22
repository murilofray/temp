import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule, Table } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { Fornecedor } from '../../model/fornecedor';
import { Bem } from '../../model/bem';
import { PropostaBem } from '../../model/propostaBem';
import { BemService } from '../../services/bem.service';
import { FornecedorService } from '../../services/fornecedor.service';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';
import { PesquisaPreco } from '../../model/pesquisaPreco';

@Component({
  selector: 'app-bem-consolidar-proponente',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, CommonModule, DropdownModule, ToolbarModule, ToastModule],
  templateUrl: './bem-consolidar-proponente.component.html',
  styleUrl: './bem-consolidar-proponente.component.scss',
})
export class BemConsolidarProponenteComponent {
  @ViewChildren('justificativaInput') justificativaInputs: QueryList<ElementRef>;

  constructor(
    private bemService: BemService,
    private pesquisaPrecoService: PesquisaPrecoService,
    private fornecedorService: FornecedorService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  tituloPesquisa = '';
  private pesquisaPreco: PesquisaPreco;
  listaBens: any[] = [];
  bem: Bem = {
    id: undefined,
    pesquisaPrecoId: null,
    notaFiscalId: null,
    termoDoacaoId: null,
    descricao: '',
    menorValor: null,
    quantidade: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    PesquisaPreco: undefined,
    NotaFiscal: undefined,
    TermoDoacao: undefined,
    PropostaBem: undefined,
  };
  bensSelecionados: Bem[] = [];

  bemDialog: boolean = false;
  editBemDialog: boolean = false;
  deleteBemDialog: boolean = false;
  deleteBensDialog: boolean = false;

  proponenteDialog: boolean = false;
  editProponenteDialog: boolean = false;
  deleteProponenteDialog: boolean = false;
  private listaFornecedores: Fornecedor[] = [];
  private fornecedor: Fornecedor = {
    id: null,
    cidade: '',
    endereco: '',
    responsavel: '',
    nomeFantasia: '',
    telefone: '',
    email: '',
    razaoSocial: '',
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    NotaFiscal: [],
  };

  listaProponentes: Fornecedor[] = [];
  proponente: Fornecedor = {
    id: undefined,
    cnpj: '',
    cpf: '',
    cidade: '',
    endereco: '',
    responsavel: '',
    nomeFantasia: '',
    telefone: '',
    email: '',
    razaoSocial: '',
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  };
  private propostaBem: PropostaBem;

  submitted: boolean = false;
  cols: any[] = [];

  async ngOnInit() {
    const dataPesquisa = localStorage.getItem('pesquisaPreco');

    if (dataPesquisa) {
      const dadoPesquisa = JSON.parse(dataPesquisa);
      const pesquisa = await this.pesquisaPrecoService.getById(Number(dadoPesquisa.id));
      this.pesquisaPreco = pesquisa['data'];
      this.tituloPesquisa = `${this.pesquisaPreco.titulo ? this.pesquisaPreco.titulo : ''}`;
      this.buscarTodos(this.pesquisaPreco.id);
    } else {
      console.log('Nenhum dado encontrado no LocalStorage');
      const pesquisa = await this.pesquisaPrecoService.getById(Number(1));
      this.pesquisaPreco = pesquisa['data'];
      this.buscarTodos(this.pesquisaPreco.id);
      //   this.router.navigate(['/notfound']);
    }

    console.log(this.listaBens);

    this.cols = [
      { field: 'bem', header: 'Bem' },
      { field: 'quantidade', header: 'Quantidade' },
      { field: 'proponenteA', header: 'Proponente A' },
      { field: 'proponenteB', header: 'Proponente B' },
      { field: 'proponenteC', header: 'Proponente C' },
    ];
  }

  menorPreco(bem: Bem) {
    if (!bem.PropostaBem || bem.PropostaBem.length === 0) {
      return { menorValor: null, fornecedorMenorValor: null };
    }

    let { menorValor, fornecedorMenorValor } = bem.PropostaBem.reduce(
      (acc, proposta) => {
        const valorProposta = Number(proposta.valor);
        if (valorProposta < acc.menorValor) {
          acc.menorValor = valorProposta;
          acc.fornecedorMenorValor = this.listaFornecedores.find((f: Fornecedor) => f.id === proposta.fornecedorId);
        }
        return acc;
      },
      { menorValor: Infinity, fornecedorMenorValor: null },
    );
    return { menorValor, fornecedorMenorValor };
  }

  onFornecedorChange(bem: any, index: number) {
    // Exibe o campo de justificativa se o fornecedor selecionado não for o de menor valor
    bem.showJustificativa = bem.selectedFornecedorId !== bem.menorFornecedorId;

    // Coloca o foco no campo de justificativa, se necessário
    if (bem.showJustificativa) {
      setTimeout(() => this.justificativaInputs.toArray()[index].nativeElement.focus(), 0);
    } else {
      bem.justificativa = ''; // Limpa a justificativa se o menor fornecedor for selecionado
    }
  }

  private menorValorBem() {
    this.listaBens.forEach((bem) => {
      const menorFornecedor = this.menorPreco(bem).fornecedorMenorValor;
      bem.menorFornecedorId = menorFornecedor ? menorFornecedor.id : null;
      bem.selectedFornecedorId = bem.menorFornecedorId;
      bem.showJustificativa = false;
      bem.justificativa = '';
    });
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
    const resposta = await this.bemService.getByPesquisa(idPesquisa);
    this.listaBens = resposta.data;
    const respostaF = await this.fornecedorService.getByPesquisa(idPesquisa);
    this.listaFornecedores = respostaF['data'];
    this.construirListaProponentes();
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
      const doc = this.getFormattedDocument(fornecedor);
      return { nome, doc, existe, fornecedor };
    } else {
      // Se a posição é inválida, retorne um objeto padrão
      return { nome: '', doc: '', existe: false };
    }
  }

  private getFormattedDocument(fornecedor: Fornecedor): string {
    if (fornecedor.cnpj && fornecedor.cnpj.trim()) {
      return this.formatCNPJ(fornecedor.cnpj);
    } else if (fornecedor.cpf && fornecedor.cpf.trim()) {
      return this.formatCPF(fornecedor.cpf);
    }
    return '';
  }

  private formatCNPJ(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
  }

  private formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  /**
   * Constrói a lista de proponentes relacionados à pesquisa de preço específica.
   *
   * @remarks
   * Essa função verifica se a lista de fornecedores e a pesquisa de preço estão definidas.
   * Se as condições forem atendidas, ela cria um array de IDs de proponentes,
   * preenche a lista de proponentes usando um map, e imprime a lista de proponentes.
   *
   * @throws Lança um erro se a lista de fornecedores ou a pesquisa de preço não estiverem definidas.
   */
  private construirListaProponentes() {
    // Verifica se a lista de fornecedores e a pesquisa de preço estão definidas
    if (!this.listaFornecedores || !this.pesquisaPreco) {
      console.error('Lista de fornecedores ou pesquisa de preço não definida.');
      throw new Error('Lista de fornecedores ou pesquisa de preço não definida.');
    }

    // Cria um array de IDs de proponentes
    const proponentesIds = [
      this.pesquisaPreco.proponenteA,
      this.pesquisaPreco.proponenteB,
      this.pesquisaPreco.proponenteC,
    ];

    // Preenche a lista de proponentes usando map
    this.listaProponentes = proponentesIds.map((id) => this.listaFornecedores.find((f) => f.id === id));
  }

  navigateTo() {
    this.router.navigate(['conta/consolidar/B']);
  }

  navigateToPesquisa() {
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaPreco));
    this.router.navigate([`conta/pesquisa/${this.pesquisaPreco.tipo}`]);
  }
}
