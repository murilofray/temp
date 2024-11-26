import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfiguracaoService } from '../services/configuracao.service';
import { ServidorService } from 'src/app/comum/services/servidor.service';

@Component({
  selector: 'app-gerenciar-configuracoes-sistema',
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
    CalendarModule,
    InputNumberModule,
  ],
  templateUrl: './gerenciar-configuracoes-sistema.component.html',
  styleUrl: './gerenciar-configuracoes-sistema.component.scss'
})

export class GerenciarConfiguracoesSistemaComponent {
  configuracoes: any[] = [];

  displayDialogEditar: boolean = false;
  displayDialogCriar: boolean = false;

  selectedConfiguracao: any;
  newConfiguracao: any = {};
  selectedYear: any;

  constructor(
    private configuracaoService: ConfiguracaoService,
    private messageService: MessageService,
    private servidorService: ServidorService,
  ) { }

  ngOnInit() {
    this.carregarConfiguracoes();
  }

  carregarConfiguracoes() {
    this.configuracaoService.index().then((data) => {
      this.configuracoes = data.data;
    });
  }


  mostrarDialogEditar(configuracao: any) {
    this.selectedConfiguracao = { ...configuracao };
    this.selectedYear = new Date(this.selectedConfiguracao.anoLetivo);
    this.selectedYear.setYear(this.selectedConfiguracao.anoLetivo);
    this.displayDialogEditar = true;
  }

  mostrarDialogCriar() {
    this.newConfiguracao = {}; // Limpa os campos para criação
    this.displayDialogCriar = true;
  }

  salvarConfiguracao() {
    if ( this.selectedConfiguracao.id
      && this.selectedYear.getFullYear() > 0
      && this.selectedConfiguracao.tempoMinimoAssiduidade > 0
      && this.selectedConfiguracao.tempoMinimoTitulo > 0
      && this.selectedConfiguracao.cursoHorasMinimas > 0
      && this.selectedConfiguracao.cursoValidade > 0
      && this.selectedConfiguracao.CursoHorasMaxAno > 0
    ) {
      this.selectedConfiguracao.anoLetivo = this.selectedYear.getFullYear();
      
      this.selectedConfiguracao.updatedAt = new Date();
      this.configuracaoService.editarConfiguracao(this.selectedConfiguracao).then(() => {
        this.displayDialogEditar = false;
        this.carregarConfiguracoes();
      });

    } else {
      this.mostrarMensagem('Erro', 'Por favor, preencha todos os campos corretamente.', 'error');
    }
  }

  criarConfiguracao() {
    if ( this.selectedYear.getFullYear() > 0
      && this.newConfiguracao.tempoMinimoAssiduidade > 0
      && this.newConfiguracao.tempoMinimoTitulo > 0
      && this.newConfiguracao.cursoHorasMinimas > 0
      && this.newConfiguracao.cursoValidade > 0
      && this.newConfiguracao.CursoHorasMaxAno > 0
    ) {
      this.newConfiguracao.anoLetivo = this.selectedYear.getFullYear();
      
      this.newConfiguracao.createdAt = new Date();
      this.configuracaoService.criarConfiguracao(this.newConfiguracao).then(() => {
        this.displayDialogCriar = false;
        this.carregarConfiguracoes();
      });

    } else {
      this.mostrarMensagem('Erro', 'Por favor, preencha todos os campos corretamente.', 'error');
    }
  }

  mostrarMensagem(titulo: string, detalhe: string, tipo: 'success' | 'info' | 'warn' | 'error') {
    this.messageService.add({ severity: tipo, summary: titulo, detail: detalhe, life: 3000 });
  }
}
