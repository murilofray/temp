import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServidorService } from '../services/servidor.service';

  interface Servidor {
    escolaId: number;
    nome: string;
    rg: string;
    cpf: string;
    dataContratacao: Date;
    categoria: string;
    grau: string;
    pontuacaoAnual: number;
    pontuacaoAssiduidade: number;
    email: string;
    senha: string;
    createdAt: Date;
  }

@Component({
  selector: 'app-lista-servidores',
  standalone: true,
  imports: [ToolbarModule, TableModule, CommonModule, ButtonModule],
  templateUrl: './lista-servidores.component.html',
  styleUrl: './lista-servidores.component.scss'
})
export class ListaServidoresComponent {

  constructor(
    private router: Router,
    private servidorService: ServidorService
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado!');
    let data = this.servidorService.getAll().subscribe((data) => {
      this.listaServidores = data;
      console.log("DADOS: ", this.listaServidores);

      this.listaServidores.forEach(servidor => {
        servidor.cpf = this.censurarCpf(servidor.cpf);
      })

      console.log("NOVOS DADOS: ", this.listaServidores);
    })
  }

  public listaServidores: Servidor[] = [];


  public navigateToCadastroServidor() {
    this.router.navigate(['comum/cadastrar-servidor']);
  }

  public censurarCpf(cpf: string) {
    const censoredCpf = cpf.slice(0, 3) + cpf.slice(3, -2).replace(/./g, '*') + cpf.slice(-2);
    return censoredCpf;
  }
}
