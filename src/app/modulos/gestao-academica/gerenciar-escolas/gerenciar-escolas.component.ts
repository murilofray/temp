import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { EscolaService } from '../services/escola.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-gerenciar-escolas',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './gerenciar-escolas.component.html',
  styleUrls: ['./gerenciar-escolas.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class GerenciarEscolasComponent {
  displayDialog: boolean = false;
  selectedEscola: any;
  filteredEscolas: any[] = [];
  escolas: any[] = []; // Esta deve ser a lista completa de ocorrências

  constructor(
    private escolaService: EscolaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    // Exemplo de inicialização, você deve preencher com dados reais
    this.initializeEscolas();
  }

  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }

  async initializeEscolas() {
    this.escolas = await this.escolaService.getEscolas();
    this.filteredEscolas = this.escolas; // Inicializa a lista filtrada
  }

  showDialog(escola: any) {
    this.selectedEscola = escola;
    this.displayDialog = true;
  }
  clear(dt1: any) {
    dt1.clear(); // Limpa o campo de entrada
    this.filteredEscolas = this.escolas; // Restaura a lista completa
  }

  filterEscolas(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredEscolas = this.escolas.filter(
      (escola) =>
        escola.nome.toLowerCase().includes(query) || escola.cnpj.includes(query) || escola.inep.includes(query),
    );
  }

  deleteEscola(escola: any) {
    this.escolaService.deleteEscola(escola.id).then(
      (response) => {
        this.showMessage('success', 'Escola deletada com sucesso!');

        this.initializeEscolas();
      },
      (error) => {
        this.showMessage('error', 'Erro ao deletar a escola!');
      },
    );
  }

  goInserirEscola() {
    this.router.navigate(['/comum/escolas/inserir']);
  }

  goEditarEscola(escola: any) {
    this.router.navigate(['/comum/escolas/editar', { id: escola.id }]);
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';

    const somenteNumeros = cnpj.replace(/\D/g, '');

    if (somenteNumeros.length !== 14) return cnpj;

    return somenteNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return '';

    const somenteNumeros = telefone.replace(/\D/g, '');

    if (somenteNumeros.length === 10) {
      return somenteNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (somenteNumeros.length === 11) {
      return somenteNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return telefone;
  }

  confirmDelete(escola: any) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a escola <strong>"${escola.nome}"</strong>?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteEscola(escola);
      },
    });
  }
}

