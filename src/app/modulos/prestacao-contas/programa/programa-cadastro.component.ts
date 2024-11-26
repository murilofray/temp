import { Component } from '@angular/core';
import { ProgramaService } from '../services/programa.service';
import { MessageService } from 'primeng/api';
import { PDDEService } from '../services/pdde.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programa-cadastro',
  templateUrl: './programa-cadastro.component.html',
  styleUrls: ['./programa-cadastro.component.css'],
})
export class ProgramaCadastroComponent {
  programaData = {
    pddeId: 0,
    nome: '',
  };

  pddeList: any[] = [];

  constructor(
    private programaService: ProgramaService,
    private messageService: MessageService,
    private router: Router,
    private pddeService: PDDEService,
  ) {}

  async ngOnInit() {
    await this.loadPDDEs();
  }

  // Método para carregar a lista de PDDEs usando async/await
  async loadPDDEs() {
    try {
      const response = await this.pddeService.listarTodosPDDEs();
      this.pddeList = response;
      console.log('PDDEs carregados:', this.pddeList);
    } catch (error) {
      console.error('Erro ao carregar a lista de PDDEs:', error);
    }
  }

  // Método para cadastrar um programa usando async/await
  async onSubmit() {
    try {
      this.programaData.pddeId = parseInt(this.programaData.pddeId as any, 10); // Converte pddeId para número inteiro
      console.log('Dados do programa sendo enviados:', this.programaData);

      const response = await this.programaService.create(this.programaData);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cadastro do programa realizado com sucesso',
      });
      console.log('Programa cadastrado com sucesso:', response);
      this.resetForm(); // Limpa o formulário após o cadastro bem-sucedido
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar o programa',
      });
      console.error('Erro ao cadastrar o programa:', error);
    }
  }

  // Método para resetar o formulário
  resetForm() {
    this.programaData = {
      pddeId: 0,
      nome: '',
    };
  }

  // Método para navegar para a página inicial
  navigateToHome() {
    this.router.navigate(['conta/home']);
  }
}
