import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Item } from 'src/app/modulos/prestacao-contas/model/item';
import { UnidadeEnum } from 'src/app/enums/UnidadeEnum';

@Component({
  selector: 'app-gerar-termo-de-doacao',
  standalone: true,
  imports: [PdfViewerModule, CommonModule, ButtonModule],
  templateUrl: './gerar-termo-de-doacao.component.html',
  styleUrls: ['./gerar-termo-de-doacao.component.scss'],
})
export class GerarTermoDeDoacaoComponent {
  pdfSrc: any;
  pdfUrl: string | undefined;
  bens: Item[] = [
    {
      id: 1,
      pesquisaPrecoId: 1,
      quantidade: 1,
      unidade: UnidadeEnum.UNIDADE.sigla,
      descricao: 'MINI RACK PAREDE PADRÃO',
      createdAt: new Date('2024-08-20'),
    },
    {
      id: 2,
      pesquisaPrecoId: 1,
      quantidade: 2,
      unidade: UnidadeEnum.UNIDADE.sigla,
      descricao: 'LIQUIDIFICADOR INDUSTRIAL',
      createdAt: new Date('2024-08-20'),
    },
    {
      id: 3,
      pesquisaPrecoId: 1,
      quantidade: 3,
      unidade: UnidadeEnum.UNIDADE.sigla,
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
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMO DE DOAÇÃO', 105, 10, { align: 'center' });

    // Texto
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const textoIntroducao = `
      Pelo presente instrumento a (o) ASSOCIAÇÃO DE PAIS E MESTRES da ${this.escola}, faz, em conformidade com a legislação aplicável ao Programa ${this.programa} e demais normas pertinentes à matéria, a doação do(s) bem(ns), conforme discriminado(s) abaixo, adquirido(s) ou produzido(s) com recursos do referido Programa, ao(à) PREFEITURA MUNICIPAL DE ${this.cidade} para que seja(m) tombado(s) e incorporado(s) ao seu patrimônio público e destinado(s) à escola acima identificada, à qual cabe a responsabilidade pela guarda e conservação do(s) mesmo(s).
    `;
    const textLines = doc.splitTextToSize(textoIntroducao, 190);
    const lineHeight = 10;
    doc.text(textLines, 10, 20, { maxWidth: 190 });

    const startY = 20 + textLines.length * lineHeight + 10;

    // Tabela de bens
    const body = this.bens.map((bem) => [
      bem.descricao,
      bem.quantidade,
      '15762',
      bem.createdAt.toLocaleDateString(),
      '00,00',
      '00,00',
    ]);

    const totalPrecoTotal = this.bens.reduce((sum, bem) => sum + 0 * bem.quantidade, 0);

    body.push(['TOTAL', '', '', '', '', totalPrecoTotal.toFixed(2).replace('.', ',')]);

    autoTable(doc, {
      head: [['Descrição', 'Quantidade', 'Nº NF', 'Data NF', 'Preço Unit', 'Preço Total']],
      body: body,
      startY: 60,
      theme: 'grid',
      styles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
      didParseCell: function (data) {
        if (data.cell.text[0] === 'TOTAL') {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Campos de assinatura
    const signatureStartY = 60 + (this.bens.length + 1) * lineHeight + 10;
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
    this.pdfUrl = objectURL;

    console.log('PDF Src:', this.pdfSrc);
    console.log('PDF URL:', this.pdfUrl);
  }

  downloadPDF() {
    if (this.pdfUrl) {
      const a = document.createElement('a');
      a.href = this.pdfUrl;
      a.download = 'termo_doacao.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
