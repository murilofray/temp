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
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { jwtDecode } from 'jwt-decode';
import { ProgressaoService } from '../services/progressao.service';
import { DocumentoService } from '../services/documento.service';
import { ServidorService } from '../services/servidor.service';

export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-home-secretaria',
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
  templateUrl: './home-secretaria.component.html',
  providers: [MessageService],
  styleUrls: ['./home-secretaria.component.scss'],
})
export class HomeSecretariaComponent implements OnInit {
  servidoresAptos: any[] = [];
  progressoesEmAndamento: any[] = [];

  constructor(
    private servidorService: ServidorService,
    private progressaoService: ProgressaoService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.carregarServidoresAptos();
    await this.carregarProgressoesEmAndamento();
  }

  async carregarServidoresAptos() {
    try {
      const response = await this.servidorService.getAll();
      console.log(response)
      if (!response.error) {
        this.servidoresAptos = response.data.filter(
          (servidor: any) =>
            servidor.aptoParaProgressaoPorAssiduidade == true || servidor.aptoParaProgressaoPorTitulo
        );
        console.log(this.servidoresAptos)
      } else {
        this.showError('Erro ao carregar servidores aptos à progressão.');
      }
    } catch (error) {
      this.showError('Erro ao carregar servidores aptos.');
    }
  }

  async carregarProgressoesEmAndamento() {
    try {
      const response = await this.progressaoService.index();
      console.log(response) 
      if (!response.error) {
        this.progressoesEmAndamento = response.data.filter(
          (progressao: any) => progressao.aprovado === null
        );
      } else {
        this.showError('Erro ao carregar progresso em andamento.');
      }
    } catch (error) {
      this.showError('Erro ao carregar progresso em andamento.');
    }
  }

  async iniciarProgressao(servidor: any) {
    try {
      const progressaoData = {
        servidorId: servidor.id,
        data: new Date(),
        tipo: servidor.aptoParaProgressaoPorAssiduidade ? 'ASSIDUIDADE' : 'TITULO',
        aprovado: null,
        detalhes: `Progressão por ${servidor.aptoParaProgressaoPorAssiduidade ? 'assiduidade' : 'título'}`,
        aprovadoPor: null,
      };
      const response = await this.progressaoService.createProgressao(progressaoData);
      if (!response.error) {
        this.showSuccess('Progressão iniciada com sucesso.');
        await this.carregarServidoresAptos();
        await this.carregarProgressoesEmAndamento();
      } else {
        this.showError('Erro ao iniciar progressão.');
      }
    } catch (error) {
      this.showError('Erro ao iniciar progressão.');
    }
  }

  async aprovarProgressao(progressao: any) {
    try {
      const response = await this.progressaoService.editarProgressao(
        progressao.id,
        progressao.servidorId,
        progressao.data,
        progressao.tipo,
        true,
        progressao.detalhes,
        1 // ID do usuário aprovador (substituir conforme necessário)
      );
      if (!response.error) {
        this.showSuccess('Progressão aprovada com sucesso.');
        await this.carregarProgressoesEmAndamento();
      } else {
        this.showError('Erro ao aprovar progressão.');
      }
    } catch (error) {
      this.showError('Erro ao aprovar progressão.');
    }
  }

  async recusarProgressao(progressao: any) {
    try {
      const response = await this.progressaoService.editarProgressao(
        progressao.id,
        progressao.servidorId,
        progressao.data,
        progressao.tipo,
        false,
        progressao.detalhes,
        1 // ID do usuário que recusa (substituir conforme necessário)
      );
      if (!response.error) {
        this.showSuccess('Progressão recusada com sucesso.');
        await this.carregarProgressoesEmAndamento();
      } else {
        this.showError('Erro ao recusar progressão.');
      }
    } catch (error) {
      this.showError('Erro ao recusar progressão.');
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}