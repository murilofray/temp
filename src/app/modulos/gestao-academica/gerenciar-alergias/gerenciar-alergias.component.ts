import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AlergiaService } from '../services/alergia/alergia.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TipoAlergiaService } from '../services/tipo-alergia/tipo-alergia.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { RouterModule } from '@angular/router';
import { Alergia } from '../model/alergia';
import { TipoAlergia } from '../model/tipoAlergia';
import { Servidor } from '../model/servidor';
import { UserInfoService } from 'src/app/utils/services/user.service';

@Component({
  selector: 'app-gerenciar-alergias',
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
  templateUrl: './gerenciar-alergias.component.html',
  styleUrl: './gerenciar-alergias.component.scss',
})
export class GerenciarAlergiasComponent {
  alergiaForm = this.formBuilder.group({
    descricao: ['', Validators.required],
    tipo: ['', Validators.required],
  });

  public user;
  public userServidor: Servidor;

  loading: boolean = false;

  alergias: Alergia[] = [];
  alergiaSelecionada: Alergia;

  editarAlergiaDescricao: string = '';

  tiposAlergias: TipoAlergia[] = [];
  tiposAlergiasRelatorio: TipoAlergia[] = [];
  tipoAlergiaRelatorio: TipoAlergia;

  cadastroDialogVisivel: boolean = false;
  deletarAlergiaDialogVisivel: boolean = false;
  editarAlergiaDialogVisivel: boolean = false;
  relatorioAlergiaDialogVisivel: boolean = false;

  @ViewChild('dt1') dataTable: Table;

  constructor(
    private alergiaService: AlergiaService,
    private tipoAlergiaService: TipoAlergiaService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private userService: UserInfoService
  ) {}

  ngOnInit() {
    this.getUserInfo()

    this.alergiaService.index().then((data) => {
      this.alergias = data;
    });

    this.tipoAlergiaService.index().then((data) => {
      this.tiposAlergias = data;
      this.tiposAlergiasRelatorio = [{ id: -1, descricao: 'Todos' }, ...this.tiposAlergias];
    });
  }

  getUserInfo() {
    this.user = this.userService.getUserInfo()
    this.userServidor = this.user.user
  }

  async downloadRelatorio() {
    this.alergiaService.downloadRelatorioAlergia(+this.tipoAlergiaRelatorio, this.userServidor.escolaId);
  }

  async imprimirRelatorio() {
    this.alergiaService.printRelatorioAlergia(+this.tipoAlergiaRelatorio, this.userServidor.escolaId);
  }

  async limparTipoAlergiaRelatorio() {
    this.tipoAlergiaRelatorio = null;
  }

  async editarAlergiaDialog() {
    this.editarAlergiaDialogVisivel = true;
    this.editarAlergiaDescricao = this.alergiaSelecionada?.descricao ?? '';
  }

  resetar() {
    this.alergiaSelecionada = null;
    this.editarAlergiaDescricao = '';
  }

  deletarAlergiaDialog() {
    this.confirmationService.confirm({
      message: 'Deseja deletar a alergia?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Deletar',

      accept: () => {
        this.deletarAlergia();
      },
    });
  }

  async cadastrarAlergia() {
    this.loading = true;

    if (this.alergiaForm.valid) {
      this.cadastroDialogVisivel = false;

      const tipoAlergia = this.alergiaForm.value.tipo;
      const alergia = this.alergiaForm.value.descricao;

      const resposta = await this.alergiaService.criarAlergia(alergia, +tipoAlergia);

      if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
      else {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alergia cadastrada com sucesso!' });

        this.alergias.push(resposta.data);
      }
    }

    this.loading = false;
    this.dataTable.reset();
    this.resetar();
  }

  async deletarAlergia() {
    const id = this.alergiaSelecionada.id;
    const resposta = await this.alergiaService.deletarAlergia(id);

    if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    else {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alergia deletada com sucesso!' });
      this.alergias = this.alergias.filter((element) => element.id != id);
    }

    this.dataTable.reset();
    this.resetar();
  }

  async editarAlergia() {
    const id = this.alergiaSelecionada.id;
    const descricao = this.editarAlergiaDescricao;

    const resposta = await this.alergiaService.editarAlergia(id, descricao);

    if (resposta.error) this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    else {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alergia editada com sucesso!' });
      let idx = this.alergias.findIndex((item) => item.id == id);
      this.alergias[idx].descricao = descricao;
    }

    this.editarAlergiaDialogVisivel = false;
    this.dataTable.reset();
    this.resetar();
  }
}
