import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApmService } from '../services/apmService';
import { EscolaService } from 'src/app/comum/services/escola.service';

interface APM {
  vigente: number;
  dataFormacao: Date;
  escolaId: number;
}

@Component({
  selector: 'app-cadastrar-apm',
  standalone: true,
  imports: [
    ToastModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './cadastrar-apm.component.html',
  styleUrl: './cadastrar-apm.component.scss'
})
export class CadastrarApmComponent {

  public today: Date = new Date();
  public escolas: any[] = [];
  public newApm: APM = {
    vigente: null,
    dataFormacao: null,
    escolaId: null,
  };

  constructor(
    private messageService: MessageService,
    private apmService: ApmService,
    private escolaService: EscolaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEscolas();
  }

  async carregarEscolas() {
    try {
      this.escolas = await this.escolaService.getEscolas();
      console.log('Escolas carregadas: ', this.escolas);
    } catch (error) {
      console.error('Erro ao carregar escolas: ', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar escolas!',
      });
    }
  }

  onSubmit() {
    this.newApm.dataFormacao = new Date(this.newApm.dataFormacao);
    // this.apmService.cadastrarApm(this.newApm).subscribe(
    //   (response) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Sucesso',
    //       detail: 'APM cadastrada com sucesso!',
    //     });

    //     this.newApm.vigente = null;
    //     this.newApm.dataFormacao = null;
    //     this.newApm.escolaId = null;

    //   },
    //   (error) => {
    //     console.error('Erro ao cadastrar APM:', error);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erro',
    //       detail: 'Erro ao cadastrar APM!',
    //     });
    //   }
    // );
  }

  isInvalid() {
    return (
      !this.newApm.vigente ||
      !this.newApm.dataFormacao ||
      !this.newApm.escolaId
    );
  }

  navigateToListaApms() {
    this.router.navigate(['/conta/lista-apms']);
  }

}
