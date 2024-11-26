import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NivelAcessoHandler } from 'src/app/modulos/prestacao-contas/services/nivel-acesso-handler.service';
import { EscolaService } from '../services/escola.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  escolaId: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private nivelAcessoHandler: NivelAcessoHandler,
    private escolaService: EscolaService
  ) {}

  ngOnInit() {
    if (this.isJwtValid) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit() {
    try {
      const response = await this.authService.login(this.email, this.password);
      const token = response.data.token;
      localStorage.setItem('jwt', token);

      // Mudança necessaria pelo equide de prestação de contas

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o token
      const escolaId = decodedToken.servidor?.escolaId; // Extração do escolaId
        if (escolaId) {
          this.escolaId = escolaId;

          // Buscar informações da escola e armazenar no localStorage
          const escolaInfo = await this.escolaService.getById(escolaId);
          if (escolaInfo) {
            localStorage.setItem('escola', JSON.stringify(escolaInfo));
            console.log('Informações da escola armazenadas no localStorage:', escolaInfo);
          } else {
            console.error('Erro ao buscar as informações da escola.');
          }
        } else {
          console.error('escolaId não encontrado no token JWT.');
        }
      const anoAtual = new Date().getFullYear(); // Obtém o ano atual
      localStorage.setItem('anoFiscal', anoAtual.toString())

      // Mudança necessaria pelo equide de prestação de contas

      this.router.navigate(['/']);
    } catch (error) {
      this.showError('E-mail ou senha inválidos!');
    }
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }

  isJwtValid() {
    const token = localStorage.getItem('jwt');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;

    console.log(payload);

    return expirationTime > Date.now();
  }
}
