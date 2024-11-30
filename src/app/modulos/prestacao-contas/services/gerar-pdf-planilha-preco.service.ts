import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument } from 'pdf-lib';
import { APM } from '../model/APM';
import { Item } from '../model/item';
import { PesquisaPreco } from '../model/pesquisaPreco';
import { Fornecedor } from '../model/fornecedor';
import { PropostaItem } from '../model/propostaItem';
import { Escola } from 'src/app/comum/model/escola';
import { FornecedorService } from './fornecedor.service';
import { PesquisaPrecoService } from './pesquisa-preco.service';
import { EscolaService } from 'src/app/comum/services/escola.service';
import { ApmService } from './apmService';
import { IMAGENS_PRESTACAO_CONTAS } from '../assets/image/imagensParaPDF';
import { Masker } from 'mask-validation-br';

@Injectable({
  providedIn: 'root',
})
export class GerarPDFPlanilhaPreco {
  constructor(
    private pesquisaPrecoService: PesquisaPrecoService,
    private fornecedorService: FornecedorService,
    private escolaService: EscolaService,
    private apmService: ApmService,
  ) {}

  private escola: Escola;
  private apm: APM;

  //

  private MARGEM_ESQUERDA = 15;
  private FIM_DE_PAGINA = 287;

  private async createPDFPlanilhaPreco(idFornecedor: number, listaItens: Item[]) {
    let posicaoVertical = 20;
    const fornecedor = (await this.fornecedorService.getById(idFornecedor)) as Fornecedor;
    const documentoFornecedor = this.formatarDocumentoFornecedor(fornecedor);
    const telefoneFornecedor = this.formatarTelefoneFornecedor(fornecedor);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Cabeçalho da Planilha
    doc.addImage(IMAGENS_PRESTACAO_CONTAS.FNDE_PLANILHA_PESQUISA_PRECO, 'PNG', this.MARGEM_ESQUERDA, 5, 180, 30);
    posicaoVertical += 20;

    // // Dados da escola e APM
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 54, 10, 'S');
    doc.rect(this.MARGEM_ESQUERDA + 54, posicaoVertical - 3, 126, 10, 'S');
    doc.text('1 - CÓDIGO DA ESCOLA', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('2 - NOME DA ESCOLA', this.MARGEM_ESQUERDA + 58, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(this.escola.inep, this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text(this.escola.nome.toUpperCase(), this.MARGEM_ESQUERDA + 58, posicaoVertical);
    posicaoVertical += 5;
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 90, 10, 'S');
    doc.rect(this.MARGEM_ESQUERDA + 90, posicaoVertical - 3, 90, 10, 'S');
    doc.text('3 - NOME DO CONCELHO ESCOLAR', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('4 - PESQUISA Nº', this.MARGEM_ESQUERDA + 94, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(this.apm.nome.toUpperCase(), this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('', this.MARGEM_ESQUERDA + 94, posicaoVertical);
    posicaoVertical += 5;
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 90, 10, 'S');
    doc.rect(this.MARGEM_ESQUERDA + 90, posicaoVertical - 3, 90, 10, 'S');
    doc.text('5 - MUNICÍPIO', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('6 - U.F.', this.MARGEM_ESQUERDA + 94, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text('PRESIDENTE EPITÁCIO', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('SÃO PAULO', this.MARGEM_ESQUERDA + 94, posicaoVertical);
    posicaoVertical += 7;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text(
      '7 - Solicitamos informar até: |__________________________| os preços para a relação discriminada abaixo:',
      this.MARGEM_ESQUERDA + 2,
      posicaoVertical,
    );

    // // Bens, materiais ou serviços
    posicaoVertical += 7;
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 180, 7, 'S');
    posicaoVertical += 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('8 - BENS, MATERIAIS OU SERVIÇOS', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 2;

    // // Dados da tabela
    let metaDadosTabela = null;
    const cabecalhoTabela = [
      ['8.1 - Nº', '8.2 - DISCRIMINAÇÃO', '8.3 - UNID.', '8.4 - QUANT.', '8.5 - PREÇO UNITÁRIO', '8.6 - PREÇO TOTAL'],
    ];
    const dadosProposta = this.montarCorpoTabela(listaItens, idFornecedor);

    // // Tabela principal
    autoTable(doc, {
      margin: { top: 10, left: this.MARGEM_ESQUERDA, right: this.MARGEM_ESQUERDA },
      startY: posicaoVertical,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        font: 'times',
        fontSize: 10,
        lineColor: 0,
        lineWidth: 0.2,
      },
      theme: 'grid',
      head: cabecalhoTabela,
      headStyles: {
        fontSize: 8,
      },
      body: dadosProposta.dadosTabela,
      bodyStyles: {
        halign: 'center',
      },
      didParseCell: (data) => {
        if (!metaDadosTabela) {
          metaDadosTabela = data.table;
        }
      },
    });
    posicaoVertical = metaDadosTabela.finalY;
    const larguraPrecoTotal = metaDadosTabela.columns[5].width;
    const comprimentoLinhaTotal = 180 - larguraPrecoTotal;
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical, comprimentoLinhaTotal, 7, 'S');
    doc.rect(this.MARGEM_ESQUERDA + comprimentoLinhaTotal, posicaoVertical, larguraPrecoTotal, 7, 'S');
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('\t\t\t\t\t\t\t\t\t\t\t\t\t9 - TOTAL', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text(dadosProposta.valorTotalFornecedor, this.MARGEM_ESQUERDA + 2 + comprimentoLinhaTotal, posicaoVertical);

    // // Condições a serem atendidas
    posicaoVertical += 7;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text('10 - Serão atendidas as seguintes condições:', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 5;
    doc.text('a) Todos os itens da planilha deverão ser cotados;', this.MARGEM_ESQUERDA + 12, posicaoVertical);
    posicaoVertical += 5;
    doc.text(
      'b) Período de validade da proposta: 30 (trinta) dias a partir da assinatura;',
      this.MARGEM_ESQUERDA + 12,
      posicaoVertical,
    );
    posicaoVertical += 5;
    doc.text(
      'c) Prazo de entrega / execução: _________ dias a partir da ordem de compra / serviço pela Unidade Executora;',
      this.MARGEM_ESQUERDA + 12,
      posicaoVertical,
    );
    posicaoVertical += 5;
    doc.text(
      'd) Pagamento à vista, mediante apresentação e conferência da Nota Fiscal, Certidão do INSS e FGTS;',
      this.MARGEM_ESQUERDA + 12,
      posicaoVertical,
    );

    // // Autorização
    posicaoVertical += 7;
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 180, 7, 'S');
    posicaoVertical += 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('11 - AUTORIZAÇÃO', this.MARGEM_ESQUERDA + 2, posicaoVertical);

    posicaoVertical += 5;
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 180, 37, 'S');
    posicaoVertical += 2;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text('11.1 - CONSELHO ESCOLAR', this.MARGEM_ESQUERDA + 2, posicaoVertical);

    // // // Presidente
    posicaoVertical += 7;
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.text('_________________________________________________', this.MARGEM_ESQUERDA + 90, posicaoVertical, {
      align: 'center',
    });
    posicaoVertical += 3;
    doc.setFont('times', 'normal');
    doc.text('          PRESIDENTE DO CONCELHO ESCOLAR          ', this.MARGEM_ESQUERDA + 90, posicaoVertical, {
      align: 'center',
    });

    // // // Concelho fiscal
    posicaoVertical += 7;
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.text('_________________________________________________', this.MARGEM_ESQUERDA + 45, posicaoVertical, {
      align: 'center',
    });
    doc.text('_________________________________________________', this.MARGEM_ESQUERDA + 135, posicaoVertical, {
      align: 'center',
    });
    posicaoVertical += 3;
    doc.setFont('times', 'normal');
    doc.text('                 CONSELHO FISCAL                 ', this.MARGEM_ESQUERDA + 45, posicaoVertical, {
      align: 'center',
    });
    doc.text('                 CONSELHO FISCAL                 ', this.MARGEM_ESQUERDA + 135, posicaoVertical, {
      align: 'center',
    });

    // // // Local e data
    posicaoVertical += 7;
    doc.setFontSize(8);
    doc.text('PRESIDENTE EPITÁCIO,  ________/________/________', this.MARGEM_ESQUERDA + 90, posicaoVertical, {
      align: 'center',
    });
    doc.setFont('times', 'bold');
    doc.text(
      '                                           ,  ________/________/________',
      this.MARGEM_ESQUERDA + 90,
      posicaoVertical,
      {
        align: 'center',
      },
    );

    // // Dados do proponente
    posicaoVertical += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 126, 10, 'S');
    doc.rect(this.MARGEM_ESQUERDA + 126, posicaoVertical - 3, 54, 10, 'S'); // Campo telefone
    doc.text('12.1 - NOME DO PROPONENTE', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('12.6 - TELEFONE', this.MARGEM_ESQUERDA + 128, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(fornecedor.razaoSocial.toUpperCase(), this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text(telefoneFornecedor, this.MARGEM_ESQUERDA + 132, posicaoVertical);
    posicaoVertical += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 126, 10, 'S');
    doc.rect(this.MARGEM_ESQUERDA + 126, posicaoVertical - 3, 54, 40, 'S'); // Campo do carimbo
    doc.text('12.2 - ENDEREÇO', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.text('12.7 - CARIMBO CNPJ / CPF', this.MARGEM_ESQUERDA + 128, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(fornecedor.endereco.toUpperCase(), this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 126, 10, 'S');
    doc.text('12.3 - CIDADE', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(fornecedor.cidade.toUpperCase(), this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 126, 10, 'S');
    doc.text('12.4 - CNPJ / CPF', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.setFontSize(12);
    posicaoVertical += 5;
    doc.setFont('times', 'bold');
    doc.text(documentoFornecedor, this.MARGEM_ESQUERDA + 2, posicaoVertical);
    posicaoVertical += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.rect(this.MARGEM_ESQUERDA, posicaoVertical - 3, 126, 10, 'S');
    doc.text('12.5 - ASSINATURA', this.MARGEM_ESQUERDA + 2, posicaoVertical);
    doc.setFontSize(12);

    // // //
    return doc;
  }

  /**
   *
   * @param pesquisaPrecoBem
   * @returns retorna um objeto blob do pef criado
   */
  async gerarPDFPlanilhaPreco(pesquisaPreco: PesquisaPreco) {
    let doc: jsPDF;
    // doc = await this.createPDFPlanilhaPreco(propostaBem);
    return doc.output('blob');
  }

  async salvarPDFPlanilhaPreco(pesquisaPreco: PesquisaPreco, idEscola: number) {
    await this.obterEscolaAPM(idEscola);
    const pesquisa = (await this.pesquisaPrecoService.getById(pesquisaPreco.id)) as PesquisaPreco;
    // console.log(propostaBem);

    // // Planilha para cada Proponente
    let docA: jsPDF, docB: jsPDF, docC: jsPDF;
    docA = await this.createPDFPlanilhaPreco(pesquisa.proponenteA, pesquisa.Item);
    docB = await this.createPDFPlanilhaPreco(pesquisa.proponenteB, pesquisa.Item);
    docC = await this.createPDFPlanilhaPreco(pesquisa.proponenteC, pesquisa.Item);

    // // União em um único PDF
    const mergedPdf = await PDFDocument.create();
    // // // Obter o blob
    const docABlob = docA.output('blob');
    const docBBlob = docB.output('blob');
    const docCBlob = docC.output('blob');

    // // // Transformar em bytes
    const docABytes = await docABlob.arrayBuffer();
    const docBBytes = await docBBlob.arrayBuffer();
    const docCBytes = await docCBlob.arrayBuffer();

    // // // Carregando com o PDFDocumment
    const pdfADocA = await PDFDocument.load(docABytes);
    const pdfADocB = await PDFDocument.load(docBBytes);
    const pdfADocC = await PDFDocument.load(docCBytes);

    // // // Adicionando no MergePDF
    const pagesDocA = await mergedPdf.copyPages(pdfADocA, pdfADocA.getPageIndices());
    pagesDocA.forEach((page) => mergedPdf.addPage(page));
    const pagesDocB = await mergedPdf.copyPages(pdfADocB, pdfADocB.getPageIndices());
    pagesDocB.forEach((page) => mergedPdf.addPage(page));
    const pagesDocC = await mergedPdf.copyPages(pdfADocC, pdfADocC.getPageIndices());
    pagesDocC.forEach((page) => mergedPdf.addPage(page));

    // // // Construção final do PDF
    const mergedPdfBytes = await mergedPdf.save();

    // // // Realiza o download do PDF
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `Planilha_Pesquisa_Preco_${new Date().toISOString().replace(/:/g, '-')}.pdf`;
    downloadLink.click();
  }

  private async obterEscolaAPM(idEscola: number) {
    this.escola = await this.escolaService.getById(Number(idEscola));
    this.apm = await this.apmService.getByEscolaDetails(this.escola.id);
    console.log('busca por escola id:', this.apm);
  }

  private montarCorpoTabela(listaItem: Item[], idFornecedor: number) {
    let valorTotalFornecedor = 0;
    const dadosTabela = listaItem.map((item: Item, index) => {
      const proposta = item.PropostaItem.find((p: PropostaItem) => p.fornecedorId === idFornecedor);
      const valorUnitario = proposta ? proposta.valor : 0;
      const subtotal = item.quantidade * valorUnitario;
      valorTotalFornecedor += subtotal;
      return [
        String(index + 1).padStart(2, '0'),
        item.descricao,
        item.unidade,
        String(item.quantidade).padStart(2, '0'),
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(valorUnitario),
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(subtotal),
      ];
    });
    return {
      dadosTabela,
      valorTotalFornecedor: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valorTotalFornecedor), // Formata o total no padrão monetário
    };
  }

  private formatarDocumentoFornecedor(fornecedor: Fornecedor): string {
    if (fornecedor.cnpj && fornecedor.cnpj.trim()) return `${Masker.cnpj(fornecedor.cnpj)}`;
    else if (fornecedor.cpf && fornecedor.cpf.trim()) return `${Masker.cpf(fornecedor.cpf)}`;
    else return '';
  }

  private formatarTelefoneFornecedor(fornecedor: Fornecedor): string {
    if (fornecedor.telefone && fornecedor.telefone.trim()) return `${Masker.phone(fornecedor.telefone)}`;
    else return '';
  }
}
