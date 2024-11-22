import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  async onSubmit() {
    try {
      const response = await this.authService.login(this.email, this.password);
      const token = response.data.token;

      localStorage.setItem('jwt', token);
      this.router.navigate(['/']);
    } catch (error) {
      this.showError('E-mail ou senha inválidos!');
    }
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
