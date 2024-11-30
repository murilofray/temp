import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PesquisaPrecoService } from '../../services/pesquisa-preco.service';
import { PesquisaPreco } from '../../model/pesquisaPreco';
import { PrestacaoContas } from '../../model/prestacaoContas';
import { PrestacaoContasService } from '../../services/prestacao-contas.service';
import { NivelAcessoHandler } from '../../services/nivel-acesso-handler.service';
import { GerarPDFConsolidaçãoPesquisaPreco } from '../../services/gerar-pdf-consolidacao-pesquisa.service';

@Component({
  selector: 'app-lista-pesquisa-precos',
  templateUrl: './lista-pesquisa-precos.component.html',
  styleUrl: './lista-pesquisa-precos.component.scss',
})
export class ListaPesquisaPrecosComponent implements OnInit {
  constructor(
    private pesquisaPrecoService: PesquisaPrecoService,
    private prestacaoContasService: PrestacaoContasService,
    private gerarPDFPesquisaPreco: GerarPDFConsolidaçãoPesquisaPreco,
    private messageService: MessageService,
    private niveisAcesso: NivelAcessoHandler,
    private router: Router,
  ) {}
  isGestor: boolean = false;
  isApenasAPM: boolean = false;
  private prestacaoContas: PrestacaoContas;
  private createPesquisaPreco: PesquisaPreco = {
    id: undefined,
    prestacaoContasId: undefined,
    programaId: undefined,
    tipo: undefined,
    titulo: undefined,
    proponenteA: undefined,
    orcamentoA: undefined,
    proponenteB: undefined,
    orcamentoB: undefined,
    proponenteC: undefined,
    orcamentoC: undefined,
    consolidado: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    PrestacaoContas: undefined,
    DocumentoScanA: undefined,
    DocumentoScanB: undefined,
    DocumentoScanC: undefined,
    Programa: undefined,
    Item: undefined,
  };
  submitted: boolean = false;
  headerDialogNew: string = '';
  createPesquisaDialog: Boolean = false;
  deletePesquisaDialog: Boolean = false;
  listaPesquisa: any[] = [];
  pesquisasFiltradas: any[] = [];
  pesquisaSelecionada: PesquisaPreco;
  tituloPesquisa: string;
  infoPesquisas = '';
  programasDropdown: any[] = [];
  programaSelecionado: any;

  /**
   * Inicializa o componente recuperando o ID da PrestacaoContas do armazenamento local,
   * buscando os dados relacionados à PrestacaoContas e PesquisaPreco, e configurando as colunas da tabela de dados.
   *
   * @remarks
   * Esta função verifica se um ID da PrestacaoContas existe no armazenamento local. Se existir, ele recupera o ID e o atribui a `this.idPrestacaoContas`.
   * Se o ID não for encontrado, ele navega para a rota "notFound".
   * Depois disso, ele chama os métodos `buscarPrestacao` e `buscarTodas` para buscar os dados relacionados à PrestacaoContas e PesquisaPreco.
   * Por fim, ele configura as colunas para a tabela de dados.
   */
  async ngOnInit() {
    const dataPrestacao = localStorage.getItem('prestacaoContas');

    if (dataPrestacao) {
      this.isGestor = this.niveisAcesso.isGestor();
      this.isApenasAPM = this.niveisAcesso.isApenasAPM();
      this.prestacaoContas = await this.prestacaoContasService.getById(Number(JSON.parse(dataPrestacao).id));
      this.buscarTodas(this.prestacaoContas.id);
      this.coletarProgramas();
    } else {
      this.router.navigate(['/notfound']);
    }
  }

  acessarPesquisa(id: number) {
    this.pesquisaSelecionada = this.listaPesquisa.find((item) => item.id === id);
    localStorage.setItem('pesquisaPreco', JSON.stringify(this.pesquisaSelecionada));
    this.router.navigate([`/conta/pesquisa`]);
  }

  /**
   * Abre a caixa de diálogo para criar um novo registro de PesquisaPreco.
   *
   * Esta função define a propriedade `createPesquisaDialog` como `true`,
   * prepara o objeto `createPesquisaPreco` com o `id` da `prestacaoContas` atual e o `tipo` fornecido,
   * e então abre a caixa de diálogo para permitir que o usuário insira os dados necessários para o novo registro de PesquisaPreco.
   *
   * @param tipo - O tipo de PesquisaPreco a ser criado.
   */
  createPesquisa(tipo: string) {
    if (tipo === 'B') this.headerDialogNew = 'Nova Pesquisa de Preços: Bens';
    else this.headerDialogNew = 'Nova Pesquisa de Preço: Serviços';
    this.createPesquisaDialog = true;
    this.createPesquisaPreco.prestacaoContasId = this.prestacaoContas.id;
    this.createPesquisaPreco.tipo = tipo;
  }

  /**
   * Lida com o processo de salvar um novo registro de PesquisaPreco.
   *
   * Esta função define o título do novo registro de PesquisaPreco para o valor de `this.tituloPesquisa`,
   * em seguida, tenta criar o registro usando o método `create` do `pesquisaPrecoService`.
   * Se a criação for item-sucedida, ele exibe uma mensagem de sucesso, atualiza o armazenamento local com o novo registro,
   * e navega para a página correspondente da PesquisaPreco.
   * Se a criação falhar, ele exibe uma mensagem de erro.
   *
   * @throws Lançará um erro se o processo de criação falhar.
   */
  async salvarPesquisa() {
    this.submitted = true;
    let hasError = false;

    if (!this.programaSelecionado) {
      this.mensagemErroCampo('Programa');
      hasError = true;
    }

    if (!this.tituloPesquisa?.trim()) {
      this.mensagemErroCampo('Descrição');
      hasError = true;
    }

    if (hasError) return;

    this.createPesquisaPreco.titulo = this.tituloPesquisa.trim();
    this.createPesquisaPreco.programaId = this.programaSelecionado.id;

    try {
      const resposta = await this.pesquisaPrecoService.create(this.createPesquisaPreco);
      if (resposta) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pesquisa Preço criada com sucesso!',
        });

        this.createPesquisaPreco = await this.pesquisaPrecoService.getById(resposta.id);
        localStorage.setItem('prestacaoContas', JSON.stringify(this.prestacaoContas));
        localStorage.setItem('pesquisaPreco', JSON.stringify(this.createPesquisaPreco as PesquisaPreco));
        this.router.navigate([`/conta/pesquisa`]);
        this.hideDialog();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar a Pesquisa de Preço!',
        });
      }
    } catch (error) {
      console.error('erro: ', error);
    }
  }

  deletePesquisa(id: number) {
    this.pesquisaSelecionada = this.listaPesquisa.find((item) => item.id === id);
    this.deletePesquisaDialog = true;
  }

  async confirmDelete() {
    try {
      await this.pesquisaPrecoService.delete(this.pesquisaSelecionada.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Pesquisa Preço excluída com sucesso.',
      });
    } catch (error) {
      console.error(`Erro aconteceu:\n ${error}`);
      this.messageService.add({
        severity: 'error',
        summary: 'Proponentes Associados!',
        detail: `Não foi possível excluir a Pesquisa de Preço. \nA Pesquisa possui proponentes associados.`,
        life: 8000,
      });
    } finally {
      this.buscarTodas(this.prestacaoContas.id);
      this.hideDialog();
    }
  }

  /**
   * Recupera todas as PesquisaPreco relacionadas à PrestacaoContas atual.
   *
   * @remarks
   * Esta função busca todos os registros de PesquisaPreco associados ao `this.prestacaoContas.id` fornecido
   * usando o método `getByPrestacao` do `PesquisaPrecoService`.
   * Se item-sucedido, ele atualiza a propriedade `listaPesquisa` com os registros recuperados.
   * Se ocorrer um erro durante a busca, ele exibe uma mensagem de erro usando o `MessageService`
   * e registra o erro no console.
   *
   * @param this.prestacaoContas.id - O identificador único da PrestacaoContas para recuperar registros de PesquisaPreco relacionados.
   */
  private async buscarTodas(idPrestacaoContas: number) {
    try {
      const resposta = await this.pesquisaPrecoService.getByPrestacao(Number(idPrestacaoContas));
      this.listaPesquisa = resposta as any[];
      this.pesquisasFiltradas = this.listaPesquisa;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível buscar as Pesquisas de Preço!',
      });
      console.error(`Erro aconteceu:\n ${error}`);
    }
  }

  apresentarPrograma(pesquisa: PesquisaPreco) {
    return pesquisa.Programa?.nome ? pesquisa.Programa.nome : '';
  }

  hideDialog() {
    this.submitted = false;
    this.createPesquisaDialog = false;
    this.deletePesquisaDialog = false;
    this.pesquisaSelecionada = null;
    this.tituloPesquisa = '';
    this.programaSelecionado = undefined;
  }

  private resetPesquisaPreco() {
    this.createPesquisaPreco = {
      id: undefined,
      prestacaoContasId: undefined,
      programaId: undefined,
      tipo: undefined,
      titulo: undefined,
      proponenteA: undefined,
      orcamentoA: undefined,
      proponenteB: undefined,
      orcamentoB: undefined,
      proponenteC: undefined,
      orcamentoC: undefined,
      consolidado: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      PrestacaoContas: undefined,
      DocumentoScanA: undefined,
      DocumentoScanB: undefined,
      DocumentoScanC: undefined,
      Programa: undefined,
      Item: undefined,
    };
  }

  private coletarProgramas() {
    if (this.prestacaoContas.PDDE?.Programa) {
      this.programasDropdown = this.prestacaoContas.PDDE.Programa.map((programa) => ({
        id: programa.id,
        nome: programa.nome,
      }));
    }
    this.programasDropdown.unshift({
      id: null,
      nome: '-',
    });
  }

  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }

  onRowSelect(event: any) {
    this.pesquisaSelecionada = event.data;
  }

  onRowUnselect(event: any) {
    this.pesquisaSelecionada = null;
  }

  filterPesquisas(event: any) {
    const query = event.target.value.toLowerCase();
    this.pesquisasFiltradas = this.listaPesquisa.filter(
      (pesquisaPreco: PesquisaPreco) =>
        pesquisaPreco.titulo.toLowerCase().includes(query) ||
        pesquisaPreco.Programa.nome.toLowerCase().includes(query) ||
        (typeof pesquisaPreco.createdAt === 'string'
          ? new Date(pesquisaPreco.createdAt).toISOString().includes(query)
          : pesquisaPreco.createdAt.toISOString().includes(query)),
    );
  }

  gerarTodosPDF(pesquisaPreco: PesquisaPreco) {
    this.gerarPDFPesquisaPreco.salvarPDFConsolidacaoPesquisa(pesquisaPreco);
  }
}
