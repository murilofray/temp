import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ToastModule } from 'primeng/toast';
import { ServidorService } from 'src/app/comum/services/servidor.service';


export interface JwtPayload {
  servidor: {
    id: number;
    escolaId: number;
    nome: string;
    NivelAcessoServidor: any[];
  };
  iat: number;
  exp: number;
}


@Component({
  selector: 'app-visualizar-quinquenio',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
  ],
  templateUrl: './visualizar-quinquenio.component.html',
  styleUrl: './visualizar-quinquenio.component.scss'
})
export class VisualizarQuinquenioComponent {
  anos: number = null;
  perc: number = null;
  erro: any = true

  constructor(
    private servidorService: ServidorService
  ) {}
  
  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.servidorService.buscarServidorPorId(decodedToken.servidor.id).then((data) => {
      this.anos = (data.anoDoUltimoQuinquenio - new Date().getFullYear())+5;
      this.perc = this.anos % 5;
      this.buscarInformacao();
    });
  }

  buscarInformacao(){
    if(this.perc==0){
      this.erro = false;
      return true;
    } else if(this.perc>0){
      this.erro = false;
      return false;
    } else {
      return null;
    }
  }

}
