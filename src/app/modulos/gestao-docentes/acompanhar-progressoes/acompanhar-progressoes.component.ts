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
import { ProgressaoService } from '../services/progressao.service';
import { ServidorService } from '../services/servidor.service';
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
  selector: 'app-acompanhar-progressoes',
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
  templateUrl: './acompanhar-progressoes.component.html',
  providers: [MessageService],
  styleUrls: ['./acompanhar-progressoes.component.scss'],
})
export class AcompanharProgressoesComponent implements OnInit {
  servidoresAptos: any[] = [];
  progressoesEmAndamento: any[] = [];
  servidorLogadoId: number | null = null;

  exibirDialogConfirmacao: boolean = false; // Controle do diálogo de confirmação
  progressaoSelecionada: any = null; // Armazena a progressão selecionada para aprovação/rejeição

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
    await this.carregarProgressoesEmAndamento();
  }

  async carregarProgressoesEmAndamento() {
    try {
      const response = await this.progressaoService.index();
      this.progressoesEmAndamento = response.filter(
        (progressao: any) => progressao.aprovado == null
      );
    } catch (error) {
      this.showError('Erro ao carregar progresso em andamento.');
    }
  }

  confirmarAprovarProgressao(progressao: any) {
    this.progressaoSelecionada = progressao;
    this.exibirDialogConfirmacao = true;
  }

  async aprovarProgressaoConfirmada() {
    if (!this.progressaoSelecionada) return;
  
    try {
      // Editar progressão
      const response = await this.progressaoService.editarProgressao(
        this.progressaoSelecionada.id,
        this.progressaoSelecionada.servidorId,
        this.progressaoSelecionada.data,
        this.progressaoSelecionada.tipo,
        true,
        this.progressaoSelecionada.detalhes,
        this.servidorLogadoId // ID do usuário aprovador
      );
  
      /*if (!response.error) {
        // Atualizar grau do servidor
       const atualizarGrauResponse = await this.servidorService.atualizarGrau(
          this.progressaoSelecionada.servidorId
        );
  
        if (!atualizarGrauResponse.error) {
          this.showSuccess('Progressão aprovada e grau atualizado com sucesso.');
          await this.carregarProgressoesEmAndamento();
        } else {
          this.showError('Progressão aprovada, mas ocorreu um erro ao atualizar o grau.');
        }
      } else {
        this.showError('Erro ao aprovar progressão.');
      } */
      if (!response.error) {
        this.showSuccess('Progressão concluída com sucesso.');
        await this.carregarProgressoesEmAndamento();
      }
      
    } catch (error) {
      this.showError('Erro ao aprovar progressão.');
    } finally {
      this.exibirDialogConfirmacao = false;
      this.progressaoSelecionada = null;
    }
  }
  
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
