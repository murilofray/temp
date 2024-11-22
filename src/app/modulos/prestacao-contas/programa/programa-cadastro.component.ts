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

  ngOnInit() {
    this.loadPDDEs();
  }

  loadPDDEs() {
    this.pddeService.listarTodosPDDEs().subscribe(
      (response) => {
        this.pddeList = response;
      },
      (error) => {
        console.error('Erro ao carregar a lista de PDDEs:', error);
      },
    );
  }

  onSubmit() {
    this.programaData.pddeId = parseInt(this.programaData.pddeId as any, 10); // Converte pddeId para um número inteiro
    console.log('Dados do programa sendo enviados:', this.programaData); // Verificar os dados sendo enviados

    this.programaService.create(this.programaData).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro do programa realizado com sucesso',
        });
        console.log('Programa cadastrado com sucesso:', response);
        this.resetForm(); // Limpa o formulário após o cadastro bem-sucedido
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar o programa' });
        console.error('Erro ao cadastrar o programa:', error);
      },
    );
  }

  resetForm() {
    this.programaData = {
      pddeId: 0,
      nome: '',
    };
  }

  navigateToHome() {
    this.router.navigate(['conta/home']);
  }
}
