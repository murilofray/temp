import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { AbonoService } from '../services/abono.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



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
  imports: [
    ToastModule,
    TableModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './visualizar-pontuacao-para-atribuicao.component.html',
  styleUrl: './visualizar-pontuacao-para-atribuicao.component.scss',
  providers: [MessageService],
})
export class VisualizarPontuacaoParaAtribuicaoComponent {
  pontuacaoTotal = 0;
  hoje = new Date();

  filteredOcorrencias: any[] = [];
  ocorrencias: any;
  abonos: any;

  constructor(
    private messageService: MessageService,
    private servidorService: ServidorService,
    private ocorrenciaService: OcorrenciaService,
    private abonoService: AbonoService,
  ) {}

  async ngOnInit() {
    
    this.abonoService.index().then((data) => {
      this.abonos = data;
    });

    this.buscarPontuacao();

  }

  buscarPontuacao() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.servidorService.buscarServidorPorId(decodedToken.servidor.id).then((data) => {
      this.pontuacaoTotal = data.pontuacaoAnual;
      return data.pontuacaoAnual;
    });

    this.ocorrenciaService.buscarOcorrenciasDoServidor(decodedToken.servidor.id).then((data) => {
      this.ocorrencias = data;
      this.filterOcorrencias();
    });
  }

  filterOcorrencias() {
    this.filteredOcorrencias = this.ocorrencias.filter((ocorrencia) => {

      if (ocorrencia.status === 'Aceita' && this.buscarAbono(ocorrencia.abonoId)){
        return false;
      }
  
      return true;
    });

  }
  
  
  buscarAbono(id: any): boolean {
    let abona = false;
    this.abonos.forEach((abono) => {
      if (abono.id == id) {
        abona = abono.abona;
      }
    });
    return abona ? true : false;
  }

  formatData(data: Date) {
    data = new Date(data);

    // Formata para "dd/MM/aaaa"
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
  }
}
