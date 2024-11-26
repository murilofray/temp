import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { Calendar, CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { EscolaService } from '../services/escola.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-lancar-escolas',
  standalone: true,
  imports: [
    TableModule, // Adicionando TableModule aos imports
    ButtonModule, // Adicionando ButtonModule aos imports
    DropdownModule, // Adicionando DropdownModule aos imports
    DialogModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    ListboxModule,
    InputMaskModule,
    ToastModule,
  ],
  templateUrl: './lancar-escolas.component.html',
  styleUrls: ['./lancar-escolas.component.scss'],
  providers: [MessageService],
})
export class LancarEscolasComponent {
  constructor(
    private route: ActivatedRoute,
    private escolaService: EscolaService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  showMessage(type: string, message: string) {
    this.messageService.add({
      severity: type,
      summary: type === 'success' ? 'Sucesso!' : 'Erro!',
      detail: message,
    });
  }

  escola: {
    id: any;
    nome: string;
    cnpj: string;
    inep: string;
    endereco: string;
    email: string;
    telefone: string;
    atoCriacao: string;
  } = {
    id: null,
    nome: '',
    cnpj: '',
    inep: '',
    endereco: '',
    email: '',
    telefone: '',
    atoCriacao: '',
  };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.getEscola(params['id']);
      }
    });
  }

  telefones = [''];

  async getEscola(id: number) {
    await this.escolaService.getEscolaById(id).then(
      (response) => {
        this.escola = {
          id: response.id,
          nome: response.nome,
          cnpj: response.cnpj,
          inep: response.inep,
          endereco: response.endereco,
          email: response.email,
          telefone: '',
          atoCriacao: response.atoCriacao,
        };

        this.telefones = response.Telefone.map((tel) => tel.numero);
      },
      (error) => {
        this.showMessage('error', 'Erro ao buscar a escola: ' + error.message);
      },
    );
  }

  adicionarTelefone() {
    this.telefones.push('');
  }

  removerTelefone(index: number) {
    if (this.telefones.length > 1) {
      this.telefones.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  cancelar() {
    this.router.navigate(['/comum/escolas']);
  }

  get telefonesComoObjetos() {
    return this.telefones.map((numero) => ({
      numero: numero.replace(/\D/g, ''),
    }));
  }

  enviarEscola() {
    if (
      this.escola.nome === '' ||
      this.escola.cnpj === '' ||
      this.escola.inep === '' ||
      this.escola.endereco === '' ||
      this.escola.email === '' ||
      this.telefones[0] === ''
    ) {
      this.showMessage('error', 'Preencha todos os campos requeridos (*)');
      return;
    }

    if (this.escola.id != null) {
      this.escolaService
        .updateEscola({
          ...this.escola,
          cnpj: this.escola.cnpj.replace(/\D/g, ''),
          telefone: this.telefonesComoObjetos,
        })
        .then(
          (response) => {
            this.showMessage('success', 'Escola editada com sucesso!');

            setTimeout(() => {
              this.router.navigate(['/comum/escolas']);
            }, 2000);
            // this.router.navigate(['/comum/escolas']);
          },
          (error) => {
            this.showMessage('error', 'Erro ao editar a escola: ' + error.message);
          },
        );
    } else {
      this.escolaService
        .createEscola({
          ...this.escola,
          cnpj: this.escola.cnpj.replace(/\D/g, ''),
          telefone: this.telefonesComoObjetos,
        })
        .then(
          (response) => {
            this.showMessage('success', 'Escola cadastrada com sucesso!');

            setTimeout(() => {
              this.router.navigate(['/comum/escolas']);
            }, 2000);
          },
          (error) => {
            this.showMessage('error', 'Erro ao cadastrar a escola: ' + error.message);
          },
        );
    }
  }
}

