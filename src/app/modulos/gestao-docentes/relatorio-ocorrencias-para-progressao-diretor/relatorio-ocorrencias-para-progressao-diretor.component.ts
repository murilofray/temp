import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { AbonoService } from '../services/abono.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface JwtPayload {
  servidor: {
    id: number;
    escolaId: number;
    nome: string;
    NivelAcessoServidor: any[];
  };
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-relatorio-ocorrencias-para-progressao-diretor',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
  ],
  templateUrl: './relatorio-ocorrencias-para-progressao-diretor.component.html',
  styleUrl: './relatorio-ocorrencias-para-progressao-diretor.component.scss',
  providers: [MessageService],
})

export class RelatorioOcorrenciasParaProgressaoDiretorComponent {
  professores: any = null;
  selectedProfessor: any = null;
  ocorrencias: any = null;
  abonos: any;

  constructor(
    private route: Router,
    private messageService: MessageService,
    private servidorService: ServidorService,
    private ocorrenciaService: OcorrenciaService,
    private abonoService: AbonoService,
  ) { }

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.abonoService.index().then((data) => {
      this.abonos = data;
    });

    this.servidorService.buscarServidoresPorEscola(decodedToken.servidor.escolaId).then((data) => {
      this.professores = data;
    });
  }

  filtrarOcorrenciasPorProfessor() {
    this.ocorrenciaService.buscarOcorrenciasDoServidor(this.selectedProfessor.id).then((data) => {
      this.ocorrencias = data;
    });
  }

  buscarDocente(id: any): string {
    let profEncontrado = null;
    this.professores.forEach((prof) => {
      if (prof.id == id) {
        profEncontrado = prof;
      }
    });
    return profEncontrado.nome;
  }

  buscarAbono(id: any): string {
    let abona = false;
    this.abonos.forEach((abono) => {
      if (abono.id == id) {
        abona = abono.abona;
      }
    });
    return abona ? 'Sim' : 'Não';
  }

  buscarNomeAbono(id: any): string {
    let abona = '';
    this.abonos.forEach((abono) => {
      if (abono.id == id) {
        abona = abono.nome;
      }
    });
    return abona;
  }

  gerarRelatorio() {
    if (this.selectedProfessor) {

      const doc = new jsPDF();

      doc.text(`Relatório de Ocorrências de ${this.selectedProfessor.nome}`, 10, 10);

      autoTable(doc, {
        head: [['Data da Ocorrência', 'Registrado Por', 'Estado', 'É Abonada?', 'Tipo de Abono']],
        body: this.ocorrencias.map((ocorrencia) =>
          [
            this.formatData(ocorrencia.dataOcorrencia),
            this.buscarDocente(ocorrencia.lancadoPor),
            ocorrencia.status,
            this.verSituacaoParaAbonada(ocorrencia.status, ocorrencia.abonoId),
            this.verSituacaoParaTipoAbono(ocorrencia.status, ocorrencia.abonoId),
          ]),
        didDrawPage: () => {
          doc.setFontSize(12);
          doc.text('Relatório baixado em: '+this.formatDataComHora(new Date()), 10, doc.internal.pageSize.height - 10);
        },
      });

      doc.save('Relatorio de Ocorrencias de ' + this.selectedProfessor.nome + '.pdf');
    } else {
      this.mostrarMensagem("Aviso", "Selecione um docente para gerar relatório de ocorrências", "warn")
    }
  }

  verSituacaoParaAbonada(status: string, abonoId: number): string {
    if (status.toLowerCase() == 'aceita') {
      return this.buscarAbono(abonoId);
    } else if (status === 'Recusada') {
      return 'Não';
    } else {
      return '-'
    }
  }

  verSituacaoParaTipoAbono(status: string, abonoId: number): string {
    if (status.toLowerCase() == 'aceita' || status.toLowerCase() == 'recusada') {
      return this.buscarNomeAbono(abonoId);
    } else {
      return '-'
    }
  }

  formatData(data: Date) {
    data = new Date(data);

    // Formata para "dd/MM/aaaa"
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
  }

  formatDataComHora(data: Date): string {
    data = new Date(data);

    // Formata para "dd/MM/aaaa"
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    // Formata o horário "hh:mm"
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    return dataFormatada;
  }


  mostrarMensagem(titulo: string, detalhe: string, tipo: 'success' | 'info' | 'warn' | 'error') {
    this.messageService.add({ severity: tipo, summary: titulo, detail: detalhe, life: 3000 });
  }
}
