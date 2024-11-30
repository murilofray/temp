import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ServidorService } from '../services/servidor.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { EscolaService } from '../services/escola.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

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
  id: number;
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
  selector: 'app-perfil-servidor',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, AvatarModule, DialogModule, PasswordModule, FormsModule, ToastModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './perfil-servidor.component.html',
  styleUrl: './perfil-servidor.component.scss'
})
export class PerfilServidorComponent {

  constructor(private servidorService: ServidorService, private router: Router, private escolaService: EscolaService, private messageService: MessageService) { }

  public servidor: Servidor = { id: null, escolaId: null, nome: '', rg: '', cpf: '', dataContratacao: null, categoria: '', grau: '', pontuacaoAnual: null, pontuacaoAssiduidade: null, email: '', senha: '', createdAt: null, anoDaUltimaProgressaoPorTitulo: null, anoDaUltimaProgressaoPorAssiduidade : null, anoDoUltimoQuinquenio : null };
  public escola: Escola = { id: null, apmId: null, imagensId: null, nome: '', cnpj: '', inep: '', atoCriacao: '', endereco: '', email: '' };
  public dialogoRedefinirSenhaVisivel: boolean = false;
  public senhaAtual: string = '';
  public novaSenha: string = '';
  public confirmarNovaSenha: string = '';

  async ngOnInit(): Promise<void> { 
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: any = jwtDecode(tokenJWT);
      // console.log(decodedToken);
      this.servidor = decodedToken.servidor;
      // console.log("Servidor: ",this.servidor);

      if(this.servidor.escolaId != null){
        this.escola = await this.escolaService.getById(this.servidor.escolaId);
        // console.log("Escola: ",this.escola);
      }
    }
    else{
      // console.log('Token JWT nao encontrado ou invalido.');
      // this.router.navigate(['/login']);
    }
  }

  formatarCPF(cpf: string): string {
    if (!cpf || cpf.length !== 11) {
      return cpf;
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarCNPJ(cnpj: string): string {
    if (!cnpj || cnpj.length !== 14) {
      return cnpj;
    }
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  mostrarDialogoRedefinirSenha() {
    this.dialogoRedefinirSenhaVisivel = true;
  }

  fecharDialogoRedefinirSenha() {
    this.dialogoRedefinirSenhaVisivel = false;
  }

  async redefinirSenha() {

    if (this.novaSenha !== this.confirmarNovaSenha) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As novas senhas não coincidem.' });
      return;
    }

    if (this.senhaAtual && this.novaSenha) {
      const response = await this.servidorService.redefinirSenha(this.servidor.id, this.senhaAtual, this.novaSenha);
      if (!response.success) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: response.message });
        return;
      }

      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha redefinida com sucesso!' });
      this.fecharDialogoRedefinirSenha();
      this.confirmarNovaSenha = '';
      this.senhaAtual = '';
      this.novaSenha = '';
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos.' });
    }
  }

}
