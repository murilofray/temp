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

  async onSubmit() {
    try {
      const response = await this.contaBancariaService.create(this.contaBancaria);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cadastro da conta bancária realizado com sucesso',
      });
      console.log('Conta bancária cadastrada com sucesso:', response);
      this.displayModal = true;
      this.resetForm();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar a conta bancária',
      });
      console.error('Erro ao cadastrar a conta bancária:', error);
    }
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
