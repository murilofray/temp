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
import { ProgressaoService } from '../services/progressao.service';
import { ConfirmationService } from 'primeng/api';

export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-gerenciar-progressoes-diretor',
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
  templateUrl: './gerenciar-progressoes-diretor.component.html',
  styleUrl: './gerenciar-progressoes-diretor.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class GerenciarProgressoesDiretorComponent {
  displayDialogDetalhes: boolean = false;
  diretorLogado: any;
  professores: any;
  progressoes: any = [];
  selectedProgressao: any;

  constructor(
    private messageService: MessageService,
    private servidorService: ServidorService,
    private progressaoService: ProgressaoService,
    private confirmationService: ConfirmationService,
  ) {}

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.servidorService.buscarServidoresPorEscola(decodedToken.escolaId).then((data) => {
      this.professores = data;

      this.professores.forEach((prof) => {
        this.progressaoService.buscarProgressoesDoServidor(prof.id).then((data) => {
          if (data.data) {
            data.data.forEach((prog) => {
              this.progressoes.push(prog);
            });
          }
        });
      });
    });
  }
  atualizarProgressao(progressao: any, aprovado: boolean) {
    try {
      this.progressaoService.editarProgressao(
        progressao.id,
        progressao.servidorId,
        progressao.data,
        progressao.tipo,
        aprovado,
        progressao.detalhes,
        progressao.aprovadoPor,
      );
    } catch (err) {
      this.messageService.add({ severity: 'warn', summary: 'Erro', detail: 'Erro ao aceitar a progressão.' });
    }
    window.location.reload();
  }

  buscarNomeServidor(id: number) {
    let nome = '';
    this.professores.forEach((prof) => {
      if (prof.id == id) {
        nome = prof.nome;
      }
    });
    return `${nome}`;
  }

  mostrarDialogDetalhes(ocorrencia: any) {
    this.selectedProgressao = ocorrencia;

    this.displayDialogDetalhes = true;
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

  confirmarAceite(progressao: any) {
    const confirmacao = confirm('Tem certeza que deseja aceitar esta progressão?');
    if (confirmacao) {
      this.atualizarProgressao(progressao, true);
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Progressão aceita!' });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelado',
        detail: 'A aceitação da progressão foi cancelada.',
      });
    }
    window.location.reload();
  }
  confirmarRecusa(progressao: any) {
    const confirmacao = confirm('Tem certeza que deseja recusar esta progressão?');
    if (confirmacao) {
      this.atualizarProgressao(progressao, false);
      this.messageService.add({ severity: 'warn', summary: 'Sucesso', detail: 'Progressão recusada!' });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelado',
        detail: 'A recusa da progressão foi cancelada.',
      });
    }
    window.location.reload();
  }
}
