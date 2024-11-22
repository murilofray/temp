import { Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { jwtDecode } from 'jwt-decode';
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
  selector: 'app-visualizar-ocorrencias',
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
  templateUrl: './visualizar-ocorrencias.component.html',
  styleUrl: './visualizar-ocorrencias.component.scss',
  providers: [MessageService],
})
export class VisualizarOcorrenciasComponent {
  displayDialogDetalhes: boolean = false;
  displayDialogJustificar: boolean = false;
  selectedOcorrencia: any;
  selectedAbono: any;
  filteredOcorrencias: any[] = [];
  ocorrencias: any;
  uploadedFile: any = null;
  abonos: any;
  abonosNomes: any;
  abonosMap: { [id: number]: any } = {};

  constructor(
    private messageService: MessageService,
    private ocorrenciaService: OcorrenciaService,
    private abonoService: AbonoService,
  ) {}

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.abonoService.index().then((data) => {
      this.abonos = data;
    });

    this.ocorrenciaService.buscarOcorrenciasDoServidor(decodedToken.id).then((data) => {
      this.ocorrencias = data;
      this.filteredOcorrencias = this.ocorrencias;
    });
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

  mostrarDialogDetalhes(ocorrencia: any) {
    this.selectedOcorrencia = ocorrencia;

    this.abonos.forEach((abono) => {
      if (abono.id == ocorrencia.abonoId) {
        this.selectedAbono = abono;
      }
    });
    this.displayDialogDetalhes = true;
  }

  mostrarDialogJustificar(ocorrencia: any) {
    this.selectedOcorrencia = ocorrencia;
    this.selectedAbono = [];
    this.abonos.forEach((abono) => {
      if (abono.id == ocorrencia.abonoId) {
        this.selectedAbono = abono;
      }
    });
    this.displayDialogJustificar = true;
  }

  justificarOcorrencia() {
    if (this.uploadedFile && this.selectedAbono) {
      this.selectedOcorrencia.status = 'Não Avaliada';

      //this.selectedOcorrencia.atestado = this.uploadedFile.name;
      // fazer upload para o servidor -------

      this.ocorrenciaService.editarOcorrencia(
        this.selectedOcorrencia.id,
        this.selectedOcorrencia.servidorId,
        this.selectedAbono.id,
        this.selectedOcorrencia.lancadoPor,
        this.selectedOcorrencia.status,
        this.selectedOcorrencia.dataOcorrencia,
        this.selectedOcorrencia.descricao,
        null,
      );

      this.displayDialogJustificar = false;

      this.selectedAbono = [];
      this.uploadedFile = null;
    } else {
      this.mostrarMensagem('Aviso', 'Preencha corretamente os campos.', 'warn');
    }
  }

  onFileSelect(event: any) {
    this.uploadedFile = event.files[0];
  }

  filterOcorrencias() {
    this.filteredOcorrencias = this.ocorrencias.filter((ocorrencia) => ocorrencia.dataOcorrencia);
  }

  mostrarMensagem(titulo: string, detalhe: string, tipo: 'success' | 'info' | 'warn' | 'error') {
    this.messageService.add({ severity: tipo, summary: titulo, detail: detalhe, life: 3000 });
  }
}
