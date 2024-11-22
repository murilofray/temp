import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { AbonoService } from '../services/abono.service';

export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-relatorio-ocorrencias-para-progressao-diretor',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
  ],
  templateUrl: './relatorio-ocorrencias-para-progressao-diretor.component.html',
  styleUrl: './relatorio-ocorrencias-para-progressao-diretor.component.scss',
  providers: [MessageService],
})
export class RelatorioOcorrenciasParaProgressaoDiretorComponent {
  professores: any = null;
  selectedProfessor: any = null;
  selectedOcorrencia: any = null;
  abonos: any = null;
  ocorrencias: any = null;
  selectedAbono: any = null;
  displayDialogDetalhes: any = null;
  abonosMap: { [id: number]: any } = {};

  constructor(
    private messageService: MessageService,
    private servidorService: ServidorService,
    private ocorrenciaService: OcorrenciaService,
    private abonoService: AbonoService,
  ) {}

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.abonoService.index().then((data) => {
      this.abonos = data;
    });

    this.servidorService.buscarServidoresPorEscola(decodedToken.escolaId).then((data) => {
      this.professores = data;
    });
  }

  filtrarOcorrenciasPorProfessor() {
    this.ocorrenciaService.buscarOcorrenciasDoServidor(this.selectedProfessor.id).then((data) => {
      this.ocorrencias = data;
    });
  }

  mostrarDialogDetalhes(ocorrencia: any) {
    this.selectedOcorrencia = ocorrencia;

    this.abonos.forEach((abono) => {
      if (abono.id == ocorrencia.abonoId) {
        this.selectedAbono = abono;
      }
    });
    this.displayDialogDetalhes = true;
  }

  buscarAbono(id: any): string {
    let abona = false;
    this.abonos.forEach((abono) => {
      if (abono.id == id) {
        abona = abono.abona;
      }
    });
    return abona ? 'Sim' : 'Não';
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
