import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemService } from './item.service';
import { FornecedorService } from './fornecedor.service';

import jsPDF from 'jspdf';
import { PesquisaPreco } from '../model/pesquisaPreco';
import { Fornecedor } from '../model/fornecedor';
import { Item } from '../model/item';
import { PropostaItem } from '../model/propostaItem';
import { IMAGENS_PRESTACAO_CONTAS } from '../assets/image/imagensParaPDF';
import { APM } from '../model/APM';
import { Masker } from 'mask-validation-br';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root',
})
export class GerarPDFConsolidaçãoPesquisaPreco {
  constructor(
    private sanitizer: DomSanitizer,
    private itemService: ItemService,
    private fornecedorService: FornecedorService,
  ) {}

  // Deixar de ser dados estáticos
  apm: APM = {
    id: 1,
    cnpj: '33782612963550',
    nome: 'APM da Escola Escola A',
    dataFormacao: new Date('1996-06-27'),
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  };

  //

  private listaFornecedores: Fornecedor[] = [];
  private MARGEM_ESQUERDA = 10;
  private FIM_DE_PAGINA = 200;

  private construirListaProponentes(pesquisaPreco: PesquisaPreco, listaFornecedores: Fornecedor[]) {
    let listaProponentes: Fornecedor[] = [];
    if (!listaFornecedores || !pesquisaPreco) {
      throw new Error('Lista de fornecedores ou pesquisa de preço não definida.');
    } else {
      const proponentesIds = [pesquisaPreco.proponenteA, pesquisaPreco.proponenteB, pesquisaPreco.proponenteC];
      listaProponentes = proponentesIds.map((id) => listaFornecedores.find((f) => f.id === id));
    }
    return listaProponentes;
  }

  private async createPDFConsolidacaoPesquisaServico(pesquisaPrecoServico: PesquisaPreco) {
    let posicaoVertical = 30;
    let listaProponentes: Fornecedor[] = [];
    const listaBens = await this.itemService.getByPesquisa(pesquisaPrecoServico.id);
    const listaFornecedores = await this.fornecedorService.getByPesquisa(pesquisaPrecoServico.id);
    listaProponentes = this.construirListaProponentes(pesquisaPrecoServico, listaFornecedores);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // // ///
    return doc;
  }

  private async createPDFConsolidacaoPesquisa(pesquisaPreco: PesquisaPreco) {
    let posicaoVertical = 20;
    let listaProponentes: Fornecedor[] = [];
    const listaItens = await this.itemService.getByPesquisa(pesquisaPreco.id);
    const listaFornecedores = await this.fornecedorService.getByPesquisa(pesquisaPreco.id);
    listaProponentes = this.construirListaProponentes(pesquisaPreco, listaFornecedores);
    console.log(listaProponentes);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Cabeçalho da consolidação: Logo FNDE + "CONSOLIDAÇÃO DE PESQUISA DE PREÇO"
    doc.addImage(IMAGENS_PRESTACAO_CONTAS.FNDE_CONSOLIDACAO_PESQUISA_PRECO, 'PNG', this.MARGEM_ESQUERDA, 5, 277, 10);

    // BLOCO I
    // // Identificador
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('BLOCO I - IDENTIFICAÇÃO DA UNIDADE EXECUTORA PRÓPRIA (UEx)', this.MARGEM_ESQUERDA, posicaoVertical, {
      align: 'left',
    });
    // // Retângulo cinza
    doc.setFillColor(200, 200, 200);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical + 1, 277, 15, 'F');
    posicaoVertical += 5;

    // // Retângulo Branco dos dados da UEx
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 2, posicaoVertical + 1, 180, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 190, posicaoVertical + 1, 82, 5, 'FD');

    // // Dados da UEx
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('01 - Razão Social', this.MARGEM_ESQUERDA + 4, posicaoVertical);
    doc.text('02 - CNPJ', this.MARGEM_ESQUERDA + 192, posicaoVertical);
    doc.setFontSize(10);
    posicaoVertical += 5;
    doc.text(this.apm.nome.toUpperCase(), this.MARGEM_ESQUERDA + 3, posicaoVertical);
    doc.text(Masker.cnpj(this.apm.cnpj), this.MARGEM_ESQUERDA + 193, posicaoVertical);

    // BLOCO II
    posicaoVertical += 10;
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text(
      'BLOCO II - IDENTIFICAÇÃO DOS PROPONENTES (Fornecedores de produtos ou prestadores de serviços)',
      this.MARGEM_ESQUERDA,
      posicaoVertical,
      {
        align: 'left',
      },
    );

    // // Retângulo cinza
    doc.setFillColor(200, 200, 200);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical + 1, 277, 23, 'F');
    posicaoVertical += 5;

    // // Inserção dos dados dos proponentes
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    // // Label de razão social
    doc.text('03 - Razão Social do Proponente (A)', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('03 - Razão Social do Proponente (B)', this.MARGEM_ESQUERDA + 98, posicaoVertical);
    doc.text('03 - Razão Social do Proponente (C)', this.MARGEM_ESQUERDA + 192, posicaoVertical);

    // // Retângulo Branco razão social dos proponentes
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 2, posicaoVertical + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 98, posicaoVertical + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 192, posicaoVertical + 1, 80, 5, 'FD');

    // // Razão social dos proponentes
    posicaoVertical += 5;
    doc.setFontSize(10);
    doc.text(listaFornecedores[0].razaoSocial.toUpperCase(), this.MARGEM_ESQUERDA + 4, posicaoVertical);
    doc.text(listaFornecedores[1].razaoSocial.toUpperCase(), this.MARGEM_ESQUERDA + 100, posicaoVertical);
    doc.text(listaFornecedores[2].razaoSocial.toUpperCase(), this.MARGEM_ESQUERDA + 194, posicaoVertical);
    posicaoVertical += 5;
    doc.setFontSize(7);
    doc.text('04 - CNPJ do Proponente (A)', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('04 - CNPJ do Proponente (B)', this.MARGEM_ESQUERDA + 98, posicaoVertical);
    doc.text('04 - CNPJ do Proponente (C)', this.MARGEM_ESQUERDA + 192, posicaoVertical);

    // // Retângulo Branco cnpj dos proponentes
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 2, posicaoVertical + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 98, posicaoVertical + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 192, posicaoVertical + 1, 80, 5, 'FD');
    posicaoVertical += 5;
    doc.setFontSize(10);
    doc.text(this.formatarDocumentoFornecedor(listaProponentes[0]), this.MARGEM_ESQUERDA + 4, posicaoVertical);
    doc.text(this.formatarDocumentoFornecedor(listaProponentes[1]), this.MARGEM_ESQUERDA + 100, posicaoVertical);
    doc.text(this.formatarDocumentoFornecedor(listaProponentes[2]), this.MARGEM_ESQUERDA + 194, posicaoVertical);

    // BLOCO III
    posicaoVertical += 10;
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('BLOCO III - PROPOSTAS (R$ 1,00)', this.MARGEM_ESQUERDA, posicaoVertical, {
      align: 'left',
    });

    // // Cabeçalho da tabela
    const cabecalhoTabelaPrincipal = [
      [
        '05 - Item',
        '06 - Descrição dos Produtos e Serviços',
        '07 - Unid.',
        '08 - Quant.',
        '09 - Valor Proponente (A)',
        '10 - Valor Proponente (B)',
        '11 - Valor Proponente (C)',
      ],
    ];

    // // Linhas da tabela => Informações dos bens e valores de cada proponente
    const dadosTabela = listaItens.map((item: Item, index) => [
      String(index + 1).padStart(2, '0'),
      item.descricao,
      item.unidade,
      String(item.quantidade).padStart(2, '0'),
      ...item.PropostaItem.map((p: PropostaItem) =>
        parseFloat(p.valor.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ), // Propostas de valores
    ]);

    // // // Informações da tabela secundária
    const totaisProponente = this.calcularTotalPorProponente(listaItens);
    const cabecalhoTabelaSecundaria = [['', 'Proponente (A)', 'Proponente (B)', 'Proponente (C)']];
    const corpoTabelaSecundaria = [
      ['12 - Valor Total da Proposta', totaisProponente[0].total, totaisProponente[1].total, totaisProponente[2].total],
      [
        '13 - Valor Total da Proposta com Desconto',
        totaisProponente[0].total,
        totaisProponente[1].total,
        totaisProponente[2].total,
      ],
    ];

    // // // Obter o tamanho da tabelas
    const tamanhosTabelaPrincipal = await this.obterAlturaTabela(cabecalhoTabelaPrincipal, dadosTabela);
    const tamanhosTabelaSecundária = await this.obterAlturaTabela(cabecalhoTabelaSecundaria, corpoTabelaSecundaria);

    // // Retângulo cinza
    doc.setFillColor(200, 200, 200);
    doc.rect(
      this.MARGEM_ESQUERDA,
      posicaoVertical + 1,
      277,
      tamanhosTabelaPrincipal[0] + tamanhosTabelaSecundária[0] + 7,
      'F',
    );
    posicaoVertical += 2;

    // // Tabela principal
    autoTable(doc, {
      margin: { top: 10, left: 12, right: 12 },
      startY: posicaoVertical,
      headStyles: {
        fontSize: 7,
        fontStyle: 'normal',
        halign: 'center',
      },
      head: cabecalhoTabelaPrincipal,
      theme: 'grid',
      body: dadosTabela,
      bodyStyles: {
        fontSize: 10,
        halign: 'center',
      },
      columnStyles: { 1: { halign: 'left' } },
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        font: 'times',
      },
    });

    posicaoVertical += tamanhosTabelaPrincipal[0] + 5;

    // // Tabela secundária: totais por proponentes
    autoTable(doc, {
      margin: { top: 10, left: tamanhosTabelaPrincipal[4] + this.MARGEM_ESQUERDA, right: 12 },
      startY: posicaoVertical,
      headStyles: {
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
      },
      head: cabecalhoTabelaSecundaria,
      theme: 'grid',
      body: corpoTabelaSecundaria,
      bodyStyles: {
        fontSize: 10,
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'right', fontSize: 7 },
        1: { cellWidth: tamanhosTabelaPrincipal[1], fillColor: 255 },
        2: { cellWidth: tamanhosTabelaPrincipal[2], fillColor: 255 },
        3: { cellWidth: tamanhosTabelaPrincipal[3], fillColor: 255 },
      },
      styles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        font: 'times',
      },
    });

    posicaoVertical += tamanhosTabelaSecundária[0] + 7;

    // BLOCO IV
    // // Verificar os menores proponentes
    const apuracao = this.apurarPropostas(listaItens);
    const totalApuracao = apuracao.A.total + apuracao.B.total + apuracao.C.total;

    // // Identificador
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('BLOCO IV - APURAÇÃO DAS PROPOSTAS', this.MARGEM_ESQUERDA, posicaoVertical, {
      align: 'left',
    });

    // Retângulo cinza
    doc.setFillColor(200, 200, 200);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical + 1, 277, 30, 'F');
    posicaoVertical += 3;

    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('14 - Itens de Menor Valor', this.MARGEM_ESQUERDA + 27, posicaoVertical);
    doc.text('15 - Valor Total dos Itens de Menor Valor', this.MARGEM_ESQUERDA + 235, posicaoVertical);

    posicaoVertical += 1;
    const posicaoApuracao = posicaoVertical;
    // // Retângulo brancos dos itens por proponentes
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 27, posicaoVertical, 207, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 235, posicaoVertical, 40, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 27, posicaoVertical + 6, 207, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 235, posicaoVertical + 6, 40, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 27, posicaoVertical + 12, 207, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 235, posicaoVertical + 12, 40, 5, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    posicaoVertical += 3;
    doc.text('Proponente (A)', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 6;
    doc.text('Proponente (B)', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 6;
    doc.text('Proponente (C)', this.MARGEM_ESQUERDA + 2, posicaoVertical);

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text(apuracao.A.itens.toString(), this.MARGEM_ESQUERDA + 29, posicaoApuracao + 4);
    doc.text(apuracao.B.itens.toString(), this.MARGEM_ESQUERDA + 29, posicaoApuracao + 10);
    doc.text(apuracao.C.itens.toString(), this.MARGEM_ESQUERDA + 29, posicaoApuracao + 16);
    doc.text(
      apuracao.A.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      this.MARGEM_ESQUERDA + 240,
      posicaoApuracao + 4,
      { align: 'center' },
    );
    doc.text(
      apuracao.B.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      this.MARGEM_ESQUERDA + 240,
      posicaoApuracao + 10,
      { align: 'center' },
    );
    doc.text(
      apuracao.C.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      this.MARGEM_ESQUERDA + 240,
      posicaoApuracao + 16,
      { align: 'center' },
    );

    posicaoVertical += 7;
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 235, posicaoVertical - 1, 40, 5, 'FD');
    posicaoVertical += 3;
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('16 - Valor Total', this.MARGEM_ESQUERDA + 215, posicaoVertical);
    doc.setFontSize(10);
    doc.text(
      totalApuracao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      this.MARGEM_ESQUERDA + 237,
      posicaoVertical,
    );

    // BLOCO V
    // // Retângulo cinza
    doc.setFillColor(200, 200, 200);
    doc.rect(this.MARGEM_ESQUERDA, this.FIM_DE_PAGINA - 19 + 1, 277, 15, 'F');

    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('BLOCO V - AUTENTICAÇÃO', this.MARGEM_ESQUERDA, this.FIM_DE_PAGINA - 19, {
      align: 'left',
    });

    // // Inserção dos dados de autenticação
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('17 - Local e Data', this.MARGEM_ESQUERDA + 2, this.FIM_DE_PAGINA - 15);
    doc.text(
      '18 - Nome do Dirigente ou do Representante Legal da UEx',
      this.MARGEM_ESQUERDA + 98,
      this.FIM_DE_PAGINA - 15,
    );
    doc.text(
      '19 - Assinatura do Dirigente ou do Representante Legal da UEx',
      this.MARGEM_ESQUERDA + 192,
      this.FIM_DE_PAGINA - 15,
    );

    // // Retângulo branco da autenticação
    doc.setFillColor(255, 255, 255);
    doc.rect(this.MARGEM_ESQUERDA + 2, this.FIM_DE_PAGINA - 15 + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 98, this.FIM_DE_PAGINA - 15 + 1, 80, 5, 'FD');
    doc.rect(this.MARGEM_ESQUERDA + 192, this.FIM_DE_PAGINA - 15 + 1, 80, 5, 'FD');

    doc.setFontSize(10);
    doc.text(
      `PRESIDENTE EPITÁCIO, ${new Date().toLocaleDateString('pt-BR')}`,
      this.MARGEM_ESQUERDA + 4,
      this.FIM_DE_PAGINA - 10,
    );
    doc.text(`GISLAINE APARECIDA PEREIRA CUNHA`, this.MARGEM_ESQUERDA + 100, this.FIM_DE_PAGINA - 10);
    doc.text('', this.MARGEM_ESQUERDA + 194, this.FIM_DE_PAGINA - 10);

    // Salvar o PDF
    return doc;
  }

  private async obterAlturaTabela(cabecalhoTabela: any, dadosTabela: any) {
    let tableMeta = null;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    autoTable(doc, {
      startY: 0,
      headStyles: {
        font: 'times',
        fontSize: 7,
        fontStyle: 'normal',
      },
      head: cabecalhoTabela,
      theme: 'grid',
      body: dadosTabela,
      bodyStyles: {
        halign: 'center',
      },
      columnStyles: { 1: { halign: 'left' } },
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      didParseCell: (data) => {
        if (!tableMeta) {
          tableMeta = data.table;
        }
      },
    });
    const alturaTabela = Math.ceil(tableMeta.finalY);
    let larguraColuna4 = 0;
    let larguraColuna5 = 0;
    let larguraColuna6 = 0;

    if (tableMeta.columns[4] && tableMeta.columns[5] && tableMeta.columns[6]) {
      larguraColuna4 = tableMeta.columns[4].width;
      larguraColuna5 = tableMeta.columns[5].width;
      larguraColuna6 = tableMeta.columns[6].width;
    }
    const larguraColunas0e1 = tableMeta.columns[0].width + tableMeta.columns[1].width;

    return [alturaTabela, larguraColuna4, larguraColuna5, larguraColuna6, larguraColunas0e1];
  }

  /**
   *
   * @param pesquisaPreco
   * @returns retorna um objeto blob do pef criado
   */
  async gerarPDFConsolidacaoPesquisa(pesquisaPreco: PesquisaPreco) {
    let doc: jsPDF;
    doc = await this.createPDFConsolidacaoPesquisa(pesquisaPreco);
    return doc.output('blob');
  }

  async salvarPDFConsolidacaoPesquisa(pesquisaPreco: PesquisaPreco) {
    let doc: jsPDF;
    doc = await this.createPDFConsolidacaoPesquisa(pesquisaPreco);
    doc.save(`Consolidacao_Pesquisa_Preco_${new Date().toISOString().replace(/:/g, '-')}.pdf`);
  }

  private formatarDocumentoFornecedor(fornecedor: Fornecedor): string {
    if (fornecedor.cnpj && fornecedor.cnpj.trim()) return `${Masker.cnpj(fornecedor.cnpj)}`;
    else if (fornecedor.cpf && fornecedor.cpf.trim()) return `${Masker.cpf(fornecedor.cpf)}`;
    else return '';
  }

  private calcularTotalPorProponente(listaItens: Item[]) {
    // Mapa para acumular os totais por proponente
    const totaisPorProponente: Record<number, number> = {};

    listaItens.forEach((item: Item) => {
      item.PropostaItem.forEach((proposta: PropostaItem) => {
        const proponenteId = proposta.fornecedorId;
        const valor = proposta.valor;

        // Se o proponente já existir no mapa, soma o valor
        // Caso contrário, inicializa com o valor atual
        if (totaisPorProponente[proponenteId]) {
          totaisPorProponente[proponenteId] += valor;
        } else {
          totaisPorProponente[proponenteId] = valor;
        }
      });
    });

    // Converte o mapa em um array de objetos
    return Object.entries(totaisPorProponente).map(([proponenteId, total]) => ({
      proponenteId: parseInt(proponenteId, 10),
      total: total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }));
  }

  private apurarPropostas(listaItens: Item[]) {
    let fornecedores = {
      A: { itens: [], total: 0 },
      B: { itens: [], total: 0 },
      C: { itens: [], total: 0 },
    };
    let fornecedoresMap = new Map();
    listaItens.forEach((item: Item) =>
      item.PropostaItem.forEach((p: PropostaItem, index) => {
        let letraFornecedor = ['A', 'B', 'C'][index]; // Atribui a letra conforme a ordem
        fornecedoresMap.set(p.fornecedorId, letraFornecedor);
      }),
    );
    let indiceItem = 1;
    listaItens.forEach((item: Item) => {
      let menorValor = Number(item.menorValor);
      let melhorProponente = item.melhorProponente;
      item.PropostaItem.forEach((proposta: PropostaItem) => {
        if (melhorProponente === proposta.fornecedorId) {
          let fornecedorLetra = fornecedoresMap.get(proposta.fornecedorId);
          fornecedores[fornecedorLetra].itens.push(`${String(indiceItem).padStart(2, '0')}`);
          fornecedores[fornecedorLetra].total += menorValor;
          indiceItem++;
        }
      });
    });
    Object.keys(fornecedores).forEach((fornecedorLetra) => {
      fornecedores[fornecedorLetra].itens = fornecedores[fornecedorLetra].itens.join(', ');
    });
    return fornecedores;
  }
}
