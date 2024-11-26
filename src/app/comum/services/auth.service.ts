import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private router: Router) {}

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao fazer login: ' + error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const response = await axios.post(this.apiUrl + '/verify-token', { token });
      return response.data;
    } catch (error) {
      this.router.navigateByUrl('/login')
    }
  }
}
