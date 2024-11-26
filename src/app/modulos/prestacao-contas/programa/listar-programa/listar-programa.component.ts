import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MovimentacaoFinanceira } from '../../model/movimentacaoBancaria';
import { ContaBancariaService } from '../../services/conta-bancaria.service';
import { MovimentacaoFinanceiraService } from '../../services/movimentacao-financeira.service';
import { TipoDocumentoEnum as tde } from 'src/app/enums/TipoDocumentoEnum';
import { PDDEService } from '../../services/pdde.service';
import { PDDE } from '../../model/PDDE';
import { Programa } from '../../model/programa';
import { ProgramaService } from '../../services/programa.service';
@Component({
  selector: 'app-listar-programa',

  templateUrl: './listar-programa.component.html',
  styleUrl: './listar-programa.component.scss',
})
export class ListarProgramaComponent implements OnInit {
  constructor(
    private pddeService: PDDEService,
    private programaService: ProgramaService,
    private contaBancariaService: ContaBancariaService,
    private movimentacaoFinanceiraService: MovimentacaoFinanceiraService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const dataPDDE = localStorage.getItem('pdde');

    if (dataPDDE) {
      const dadoPDDE = JSON.parse(dataPDDE);
      const pDDEDados = await this.pddeService.getById(Number(dadoPDDE.id));
      this.pdde = pDDEDados['data'];
      this.infoPDDE = `PDDE: ${this.pdde.tipo}`;
      this.buscarTodosProgramas(this.pdde.id);
    } else {
      console.log('Nenhum dado encontrado no LocalStorage');
      const pDDEDados = await this.pddeService.getById(Number(1));
      this.pdde = pDDEDados['data'];
      this.infoPDDE = `PDDE: ${this.pdde.tipo}`;
      this.buscarTodosProgramas(this.pdde.id);
      //   this.router.navigate(['/notfound']);
    }
  }

  // Variáveis
  // // Relativas a PDDE atual
  private pdde: PDDE;
  infoPDDE: string = 'Sem PDDE selecionado';

  // // Relativas os Programs
  programa: Programa = {
    id: undefined,
    pddeId: undefined,
    nome: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  };
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  dialogPrograma: boolean = false;
  dialogDeletarPrograma: boolean = false;
  programaFiltrados: any[] = [];
  listaProgramas: any[] = []; // Esta deve ser a lista completa de programas

  submitted: boolean = false;
  private anoFiscal: number;

  apresentarValor(movFinanceira: MovimentacaoFinanceira) {
    let saida;
    let entrada;
    if (movFinanceira.tipo === 'S') {
      saida = movFinanceira.valor;
      entrada = '';
    } else {
      saida = '';
      entrada = movFinanceira.valor;
    }
    return { saida, entrada };
  }

  submmit() {
    this.resetForm();
    this.dialogPrograma = true;
  }

  editarPrograma(programa: any) {
    if (programa) {
      this.resetForm();
      this.programa = { ...programa };
      this.dialogPrograma = true;
      this.isEditMode = true;
    }
  }

  async cadastrarPrograma() {
    this.submitted = true;
    let hasError = false;

    if (!this.programa.nome.trim()) {
      this.mensagemErroCampo('um nome');
      hasError = true;
    }

    // Se houver algum erro, interrompe o processo de cadastro
    if (hasError) {
      return;
    }

    if (!this.isEditMode) this.createPrograma();
    else this.updatePrograma();

    this.resetForm(); // Limpa o formulário após o cadastro bem-sucedido
    this.buscarTodosProgramas(this.pdde.id);
  }

  private createPrograma() {
    this.programaService.create(this.programa).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cadastrado',
          life: 1500,
          detail: `Programa adicionado.`,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao cadastrar',
          life: 1500,
        });
        console.error('Erro ao cadastrar o programa:', error);
      },
    );
  }

  private updatePrograma() {
    this.programaService.update(this.programa).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cadastrado',
          life: 1500,
          detail: `Programa editado.`,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao cadastrar',
          life: 1500,
        });
        console.error('Erro ao cadastrar o programa:', error);
      },
    );
  }

  acessarPrestação(programa: Programa) {
    this.router.navigate([]);
  }

  private async buscarTodosProgramas(idPDDE: number) {
    try {
      const resposta = await this.programaService.getByPDDE(idPDDE);
      this.listaProgramas = resposta;
      this.programaFiltrados = this.listaProgramas;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `Não foi possível obter os Programas relacionados ao PDDE ${this.pdde.tipo}`,
        life: 4000,
      });
      console.error('BUSCAR TODAS:', error);
    }
  }

  hideDialog() {
    this.resetForm();
  }

  private resetForm() {
    // Dialogs
    this.dialogPrograma = false;

    //Valores
    this.isViewMode = false;
    this.submitted = false;

    // Objetos
    this.resetPrograma();
  }

  private resetPrograma() {
    this.programa = {
      id: undefined,
      pddeId: undefined,
      nome: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    };
  }

  filterProgramas(event: any) {
    const query = event.target.value.toLowerCase();
    this.programaFiltrados = this.listaProgramas.filter((programa: Programa) =>
      programa.nome.toLowerCase().includes(query),
    );
  }

  // Evento para ajustar o tamanho do diálogo ao abrir o calendário
  onCalendarShow() {
    const dialogElement = document.querySelector('p-dialog') as HTMLElement;
    if (dialogElement) {
      dialogElement.style.width = '700px'; // Ajuste de tamanho quando o calendário for aberto
    }
  }

  private mensagemErroCampo(campo: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Campo inválido',
      detail: `Informe ${campo} válido.`,
      life: 3000,
    });
  }
}
