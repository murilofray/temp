import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Bem } from 'src/app/modulos/prestacao-contas/model/bem';

@Component({
  selector: 'app-gerar-demonstrativo-execucao',
  standalone: true,
  imports: [CommonModule, ButtonModule, PdfViewerModule],
  templateUrl: './gerar-demonstrativo-execucao.component.html',
  styleUrl: './gerar-demonstrativo-execucao.component.scss',
})
export class GerarDemonstrativoExecucaoComponent {
  pdfSrc: any;
  pdfUrll: string | undefined;
  bens: Bem[] = [
    {
      id: 1,
      pesquisaPrecoId: 1,
      quantidade: 1,
      descricao: 'MINI RACK PAREDE PADRÃO',
      createdAt: new Date('2024-08-20'),
    },
    {
      id: 2,
      pesquisaPrecoId: 1,
      quantidade: 2,
      descricao: 'LIQUIDIFICADOR INDUSTRIAL',
      createdAt: new Date('2024-08-20'),
    },
    {
      id: 3,
      pesquisaPrecoId: 1,
      quantidade: 3,
      descricao: 'CONJUNTO DE MESA DE REFEITÓRIO',
      createdAt: new Date('2024-08-20'),
    },
  ];
  public escola: any = 'EMEFEI ARMÊNIO MACÁRIO RIBEIRO';
  public programa: any = 'Dinheiro Direto na Escola (PDDE)';
  public cidade: any = 'PRESIDENTE EPITÁCIO';
  public diretor: any = 'GISLAINE APARECIDA PEREIRA CUNHA';

  constructor(private sanitizer: DomSanitizer) {}

  gerarPDF() {
    const doc = new jsPDF();
    console.log('GERANDO PDF');

    // Título
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMONSTRATIVO DA EXECUÇÃO DA RECEITA E DA DESPESA E DE PAGAMENTOS EFETUADOS', 105, 10, {
      align: 'center',
    });

    // Texto
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const textoIntroducao = ``;
    const textLines = doc.splitTextToSize(textoIntroducao, 190);
    const lineHeight = 10;
    doc.text(textLines, 10, 20, { maxWidth: 190 });

    const startY = 20 + textLines.length * lineHeight + 10;

    // Título do bloco
    doc.text('Bloco 1: Identificação', 14, 27);

    // Tabela de campos especificados
    const body = [
      ['01 - Programação/Ação:', 'PROGRAMA DINHEIRO DIRETO NA ESCOLA - PDDE BÁSICO'],
      ['02 - Exercício:', '2022'],
      ['03 - Nome:', `APM DA ${this.escola}`],
      ['04 - Número do CNPJ:', '05.096.073/0001-42'],
      ['05 - Endereço:', 'AVENIDA TIBIRIÇÁ, Nº 3-33, VILA BORDON'],
      ['06 - Município:', `${this.cidade}`],
      ['07 - UF:', 'SÃO PAULO'],
    ];

    autoTable(doc, {
      head: [],
      body: body,
      startY: 30,
      theme: 'plain',
      styles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
      didParseCell: function (data) {
        // Aplica estilo em negrito para o título da linha
        if (data.row.index < 7) {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Título do segundo bloco
    doc.text('Bloco 2: Síntese da Execução da Receita e da Despesa', 14, 90 + 10);

    // Segunda Tabela de campos especificados
    const body2 = [
      ['', 'Custeio', 'Capital'],
      ['08 -  Saldo Reprogramado do Exercício Anterior', 'R$100,87', 'R$85,00'],
      ['09 - Valor Creditado pelo FNDE no Exercício', 'R$75,87', 'R$40,99'],
      ['10 - Recursos Próprios', 'R$150,70', 'R$80,80'],
      ['11 - Rendimento de Aplicação Financeira', 'R$640,30', 'R$700,87'],
      ['12 - Devolução de Recursos ao FNDE (-)', 'R$700,87', 'R$640,30'],
      ['13 - Valor Total da Receita', 'R$700,87', 'R$730,34'],
      ['14 - Valor da Despesa Realizada (-)', 'R$640,30', 'R$100,87'],
      ['15 - Saldo a Reprogramar para o Exercício Seguinte', 'R$374,87', 'R$538,20'],
      ['16 - Saldo Devolvido', 'R$2,99', 'R$7,87'],
      ['17 - Período de Execução', 'R$6,87', 'R$100,87'],
      ['18 - Nº de Escolas Atendidas', 'R$100,87', 'R$6,87'],
    ];

    autoTable(doc, {
      head: [],
      body: body2,
      startY: 95 + 7,
      theme: 'plain',
      styles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
      didParseCell: function (data) {
        if (data.row.index < 12) {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Título do segundo bloco
    doc.text('Bloco 3: Pagamentos Efetuados', 14, 195 + 10);

    // Segunda Tabela de campos especificados
    const body3 = [
      [
        '19 - Item',
        '20 - Nome do Favorecido',
        ' 21 - CNPJ ou CPF',
        '22 - Tipo de Bens e Materiais Adquiridos ou Serviços Contratados',
        '23 - Origem R$ (*)',
        '24 - Nat. Desp',
        '25 - Documento (Tipo / Nº / Data)',
        '26 - Pagamento (NºCh/OB / Data)',
        '27 - Valor (R$)',
      ],

      [
        '01',
        'ARC Squizati',
        '05.313.921/0001-28',
        'Projetor de Imagem Multilaser',
        'FNDE',
        'K',
        'NF / 5372 / 07/11/2022',
        'Cartão / 07/11/2022',
        '1418,00',
      ],
      [
        '02',
        'Squeeze Item',
        '05.313.921/0001-28',
        'Projetor de Imagem Multilaser',
        'FNDE',
        'K',
        'NF / 5372 / 07/11/2022',
        'Cartão / 07/11/2022',
        '1418,00',
      ],
    ];

    autoTable(doc, {
      head: [],
      body: body3,
      startY: 200 + 7,
      theme: 'plain',
      styles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
      didParseCell: function (data) {
        if (data.row.index < 12) {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Campos de assinatura
    const signatureStartY = 223 + (this.bens.length + 1) * lineHeight + 10;
    const leftMargin = 10;
    const middleMargin = 65;
    const rightMargin = 130;

    const columnFontSize = 7;
    doc.setFontSize(columnFontSize);

    doc.text(this.cidade + `, ${new Date().toLocaleDateString()}`, leftMargin, signatureStartY);
    doc.line(leftMargin, signatureStartY + 4, leftMargin + 40, signatureStartY + 4);
    doc.text('Local e Data', leftMargin, signatureStartY + 8);

    doc.text(this.diretor, middleMargin, signatureStartY);
    doc.line(middleMargin, signatureStartY + 4, middleMargin + 60, signatureStartY + 4);
    doc.text('Nome do(a) Responsável pela Unidade Executora Própria', middleMargin, signatureStartY + 8);

    doc.line(rightMargin + 10, signatureStartY + 4, rightMargin + 100, signatureStartY + 4);
    doc.text('Assinatura do(a) Responsável pela Unidade Executora Própria', rightMargin + 10, signatureStartY + 8);

    const pdfBlob = doc.output('blob');
    const objectURL = URL.createObjectURL(pdfBlob);

    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    this.pdfUrll = objectURL;

    console.log('PDF Src:', this.pdfSrc);
    console.log("PDF URL: '", this.pdfUrll, "'");
    return this.pdfUrll;
  }

  downloadPDF() {
    if (this.pdfUrll) {
      const a = document.createElement('a');
      a.href = this.pdfUrll;
      a.download = 'demonstrativo_execucao_receita_despesa.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
