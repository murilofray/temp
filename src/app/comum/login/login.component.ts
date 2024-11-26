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

  ngOnInit(){
    if(this.isJwtValid){
      this.router.navigate(['/']);
    }
  }

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

  isJwtValid() {
    const token = localStorage.getItem('jwt');
    if (!token) return false;
  
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000; 
    
    console.log(payload)

    return expirationTime > Date.now();
  }
}
