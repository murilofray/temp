import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TipoAlergiaService } from '../services/tipo-alergia/tipo-alergia.service';
import { Router, RouterModule } from '@angular/router';
import { TipoAlergia } from '../model/tipoAlergia';

@Component({
  selector: 'app-gerenciar-tipos-alergias',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToolbarModule,
    ListboxModule,
    RouterModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './gerenciar-tipos-alergias.component.html',
  styleUrl: './gerenciar-tipos-alergias.component.scss',
})
export class GerenciarTiposAlergiasComponent {
  tipoAlergiaSelecionada: TipoAlergia;
  tiposAlergias: TipoAlergia[] = [];

  tipoAlergiaDescricao: string = '';
  editarTipoAlergiaDescricao: string = '';

  cadastroDialogVisivel: boolean = false;
  editarTipoAlergiaDialogVisivel: boolean = false;

  @ViewChild('dt1') dataTable: Table;

  constructor(
    private tipoAlergiaService: TipoAlergiaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.tipoAlergiaService.index().then((data) => {
      this.tiposAlergias = data;
    });
  }

  deletarTipoAlergiaDialog() {
    this.confirmationService.confirm({
      message: 'Deseja deletar essa categoria?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Deletar',

      accept: () => {
        this.deletarTipoAlergia();
      },
    });
  }

  async editarTipoAlergiaDialog() {
    this.editarTipoAlergiaDialogVisivel = true;
    this.editarTipoAlergiaDescricao = this.tipoAlergiaSelecionada?.descricao ?? '';
  }

  resetar() {
    this.tipoAlergiaSelecionada = null;
    this.editarTipoAlergiaDescricao = '';
  }

  async cadastrarTipoAlergia() {
    const resposta = await this.tipoAlergiaService.cadastrar(this.tipoAlergiaDescricao);

    if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    else {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria de alergia cadastrada com sucesso!',
      });
      this.tiposAlergias.push(resposta.data);
    }

    this.cadastroDialogVisivel = false;

    this.dataTable.reset();
    this.resetar();
  }

  async deletarTipoAlergia() {
    const id = this.tipoAlergiaSelecionada.id;
    const resposta = await this.tipoAlergiaService.deletar(id);

    if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    else {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alergia deletada com sucesso!' });
      this.tiposAlergias = this.tiposAlergias.filter((element) => element.id != id);
    }

    this.dataTable.reset();
    this.resetar();
  }

  async editarTipoAlergia() {
    const id = this.tipoAlergiaSelecionada.id;
    const descricao = this.editarTipoAlergiaDescricao;

    const resposta = await this.tipoAlergiaService.editar(id, descricao);

    if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    else {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria editada com sucesso!' });
      let idx = this.tiposAlergias.findIndex((item) => item.id == id);
      this.tiposAlergias[idx].descricao = descricao;
    }

    this.editarTipoAlergiaDialogVisivel = false;

    this.dataTable.reset();
    this.resetar();
  }
}
