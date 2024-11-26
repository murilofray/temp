import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServidorService } from '../services/servidor.service';

interface Escola {
  id: number;
  apmId?: number;
  imagensId?: number;
  nome: string;
  cnpj: string;
  inep: string;
  atoCriacao: string;
  endereco: string;
  email: string;
}

interface Servidor {
  Escola: Escola;
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
  anoDaUltimaProgressaoPorAssiduidade : number;
  anoDaUltimaProgressaoPorTitulo : number;
  anoDoUltimoQuinquenio : number;
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

  async ngOnInit(): Promise<void> {
    this.buscarServidores();

  }

  public servidores: Servidor[] = [];
  public servidoresFiltrados: Servidor[] = [];


  public navigateToCadastroServidor() {
    this.router.navigate(['comum/cadastrar-servidor']);
  }

  public censurarCpf(cpf: string) {
    const censoredCpf = cpf.slice(0, 3) + cpf.slice(3, -2).replace(/./g, '*') + cpf.slice(-2);
    return censoredCpf;
  }

  async buscarServidores() {
    const resultado = await this.servidorService.buscarServidoresExcetoAPM();

    if (resultado.success) {
      this.servidores = resultado.data;

      this.servidores.forEach(servidor => {
        servidor.cpf = this.censurarCpf(servidor.cpf);
      })
      this.servidoresFiltrados = [...this.servidores];
    } else {
      console.error(resultado.message);
    } 
  }

  filtrarServidores(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();

    this.servidoresFiltrados = this.servidores.filter(servidor =>
      servidor.nome.toLowerCase().includes(valor) ||
      servidor.cpf.toLowerCase().includes(valor) ||
      servidor.Escola?.nome?.toLowerCase().includes(valor) ||
      servidor.categoria?.toLowerCase().includes(valor) ||
      servidor.grau?.toLowerCase().includes(valor) ||
      servidor.anoDaUltimaProgressaoPorAssiduidade?.toString().includes(valor) ||
      servidor.anoDaUltimaProgressaoPorTitulo?.toString().includes(valor) ||
      servidor.anoDoUltimoQuinquenio?.toString().includes(valor)
    );
  }

}
