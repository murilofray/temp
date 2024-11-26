import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { DocenteService } from '../services/docente.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { jwtDecode } from 'jwt-decode';

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
  selector: 'app-lancar-ocorrencias',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    ListboxModule,
    ToastModule,
    InputTextareaModule,
  ],
  templateUrl: './lancar-ocorrencias.component.html',
  providers: [MessageService],
  styleUrls: ['./lancar-ocorrencias.component.scss'],
})
export class LancarOcorrenciasComponent implements OnInit {
  selectedProfessor: any;
  filteredProfessores: any[] = [];
  professores: any[] = [];
  servidorLogadoId: number | null = null;
  servidorLogadoEscola: number | null = null;

  novaOcorrencia = {
    professor: null,
    observacao: '',
    data: new Date(),
  };

  constructor(
    private docenteService: DocenteService,
    private ocorrenciaService: OcorrenciaService,
    private messageService: MessageService,
  ) {}

  async ngOnInit() {
    // Decodifica o token JWT para obter o ID do servidor logado
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      this.servidorLogadoId = decodedToken.servidor.id;
      this.servidorLogadoEscola = decodedToken.servidor.escolaId;
    }

    // Carrega os professores
    try {
      const resposta = await this.docenteService.buscarDocentes();
      if (!resposta.error) {
        // Filtra apenas os professores que têm o mesmo escolaId do servidor logado
        console.log(resposta.data, this.servidorLogadoEscola);
        this.professores = resposta.data.filter((prof: any) => prof.escolaId === this.servidorLogadoEscola);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar docentes: ' + resposta.data,
        });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro desconhecido ao carregar docentes' });
    }
  }

  filterProfessores(event: any) {
    const query = event.filter.toLowerCase();
    this.filteredProfessores = this.professores.filter((prof) => prof.nome.toLowerCase().includes(query));
  }

  async enviarOcorrencia() {
    if (this.novaOcorrencia.professor) {
      const ocorrencia = {
        servidorId: this.novaOcorrencia.professor.id,
        abonoId: null,
        lancadoPor: this.servidorLogadoId, // Usa o ID do servidor logado
        status: 'Não Justificada',
        dataOcorrencia: this.novaOcorrencia.data,
        descricao: this.novaOcorrencia.observacao,
        aprovadoPor: null,
        createdAt: new Date(),
      };
      console.log(ocorrencia);

      try {
        const resposta = await this.ocorrenciaService.criarOcorrencia(ocorrencia);

        if (!resposta.error) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ocorrência enviada com sucesso!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao enviar ocorrência: ' + resposta.data,
          });
        }
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro desconhecido ao enviar ocorrência',
        });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um professor.' });
    }
  }
}
