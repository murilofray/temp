import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServidorService } from 'src/app/comum/services/servidor.service';

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
  dataUltimaAssiduidade: Date;
  dataUltimoTitulo: Date;
}

@Component({
  selector: 'app-lista-apms',
  standalone: true,
  imports: [CommonModule, TableModule, ToolbarModule, ButtonModule],
  templateUrl: './lista-apms.component.html',
  styleUrl: './lista-apms.component.scss'
})
export class ListaApmsComponent {

  constructor(private router: Router, private servidorService: ServidorService) { }

  infoAPM: string = 'Sem APM selecionada';
  
  async ngOnInit(): Promise<void> {
    this.buscarServidores();
  
  }

  public servidores: Servidor[] = []
  public servidoresFiltrados: Servidor[] = []

  public censurarCpf(cpf: string) {
    const censoredCpf = cpf.slice(0, 3) + cpf.slice(3, -2).replace(/./g, '*') + cpf.slice(-2);
    return censoredCpf;
  }

  public navigateToCadastroAPM() {
    this.router.navigate(['/conta/cadastrar-apm']);
  }

  public navigateToCadastroUsuarioAPM() {
    this.router.navigate(['/conta/cadastrar-usuario-apm']);
  }

  async buscarServidores() {
    const resultado = await this.servidorService.buscarServidoresAPM();

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
      servidor.cpf.toLowerCase().includes(valor)
    );
  }

}
