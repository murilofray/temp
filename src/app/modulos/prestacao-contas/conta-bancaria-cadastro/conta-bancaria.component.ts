import { Component } from '@angular/core';
import { ContaBancariaService } from '../services/conta-bancaria.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conta-bancaria',
  templateUrl: './conta-bancaria.component.html',
  styleUrls: ['./conta-bancaria.component.css'],
})
export class ContaBancariaComponent {
  contaBancaria = {
    escolaId: null,
    agencia: '',
    numeroConta: '',
    banco: '',
  };

  displayModal: boolean = false;

  constructor(
    private contaBancariaService: ContaBancariaService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  onSubmit() {
    this.contaBancariaService.create(this.contaBancaria).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro da conta bancaria realizado com sucesso',
        });
        console.log('Conta bancária cadastrada com sucesso:', response);
        this.displayModal = true;
        this.resetForm();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar a conta bancária' });
        console.error('Erro ao cadastrar a conta bancária:', error);
      },
    );
  }

  resetForm() {
    this.contaBancaria = {
      escolaId: null,
      agencia: '',
      numeroConta: '',
      banco: '',
    };
  }

  navigateToPDDE() {
    this.displayModal = false;
    this.router.navigate(['conta/pdde-cadastro']);
  }

  navigateToHome() {
    this.displayModal = false;
    this.router.navigate(['conta/home']);
  }
}
