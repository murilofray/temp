import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
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
  selector: 'app-visualizar-pontuacao-para-atribuicao',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './visualizar-pontuacao-para-atribuicao.component.html',
  styleUrl: './visualizar-pontuacao-para-atribuicao.component.scss',
  providers: [MessageService],
})
export class VisualizarPontuacaoParaAtribuicaoComponent {
  pontuacaoTotal = 0;
  hoje = new Date();

  constructor(
    private messageService: MessageService,
    private servidorService: ServidorService,
  ) {}

  async ngOnInit() {
    this.buscarPontuacao();
  }

  buscarPontuacao() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.servidorService.buscarServidorPorId(decodedToken.servidor.id).then((data) => {
      this.pontuacaoTotal = this.buscarDiasDoAno() - data.pontuacaoAnual;
      return data.pontuacaoAnual;
    });
  }
  1;
  buscarDiasDoAno(): number {
    const ano = this.hoje.getFullYear();

    if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0) {
      return 366; // Ano bissexto
    }
    return 365;
  }

  formatarData(data: Date) {
    data = new Date(data);

    // Formata para "dd/MM/aaaa"
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
  }
}
