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
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { jwtDecode } from 'jwt-decode';
import { ProgressaoService } from '../services/progressao.service';
import { ServidorService } from '../services/servidor.service';

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
  servidorLogadoId: number | null = null;

  exibirDialogConfirmacao: boolean = false; // Controle da visibilidade do diálogo
  servidorSelecionado: any = null; // Armazena o servidor selecionado para progressão

  constructor(
    private servidorService: ServidorService,
    private progressaoService: ProgressaoService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      this.servidorLogadoId = decodedToken.servidor.id;
    }
    await this.carregarServidoresAptos();
    await this.carregarProgressoesEmAndamento();
  }

  async carregarServidoresAptos() {
    try {
      const response = await this.servidorService.getAll();
      if (!response.error) {
        this.servidoresAptos = response.data.filter(
          (servidor: any) =>
            servidor.aptoParaProgressaoPorAssiduidade || servidor.aptoParaProgressaoPorTitulo
        );
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
      this.progressoesEmAndamento = response.filter(
        (progressao: any) => progressao.aprovado === null
      );
    } catch (error) {
      this.showError('Erro ao carregar progresso em andamento.');
    }
  }

  confirmarIniciarProgressao(servidor: any) {
    this.servidorSelecionado = servidor;
    this.exibirDialogConfirmacao = true;
  }

  async iniciarProgressaoConfirmada() {
    if (!this.servidorSelecionado) return;

    try {
      const progressaoData = {
        servidorId: this.servidorSelecionado.id,
        data: new Date(),
        tipo: this.servidorSelecionado.aptoParaProgressaoPorAssiduidade ? 'ASSIDUIDADE' : 'TITULO',
        aprovado: null,
        detalhes: 'Progressão em andamento.',
        aprovadoPor: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      const response = await this.progressaoService.createProgressao(progressaoData);
      await this.carregarServidoresAptos();

      if (!response.error) {
        this.showSuccess('Progressão iniciada com sucesso!');
      } else {
        this.showError('Erro ao iniciar a progressão.');
      }
    } catch (error) {
      this.showError('Erro ao iniciar a progressão.');
    } finally {
      this.exibirDialogConfirmacao = false;
      this.servidorSelecionado = null;
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
