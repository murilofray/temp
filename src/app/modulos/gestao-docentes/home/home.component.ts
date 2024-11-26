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
import { environment } from 'src/environments/environment';

export interface JwtPayload {
  id: number;
  escolaId: number;
  nome: string;
  nivelAcesso: string[];
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  providers: [MessageService],
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent2 implements OnInit {
  docente: any = null;
  errorMessage: string = '';
  emAndamento: boolean = false;

  constructor(
    private docenteService: DocenteService,
    private progressaoService: ProgressaoService,
    private messageService: MessageService,
    private documentoService: DocumentoService,
  ) {}

  async ngOnInit() {
    try {
      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        const decodedToken: JwtPayload = jwtDecode(tokenJWT);
        const docenteId = decodedToken.id;

        const response = await this.docenteService.buscarDocentes();
        if (!response.error) {
          this.docente = response.data.find((docente: any) => docente.id === docenteId);

          if (this.docente) {
            const progressaoResponse = await this.progressaoService.getByServidorId(this.docente.id);

            if (!progressaoResponse.error) {
              const progressoes = progressaoResponse.data;
              this.emAndamento = progressoes.some(
                (progressao: any) => progressao.tipo === 'ASSIDUIDADE' && progressao.aprovado === null,
              );
              console.log(progressaoResponse.data);
            } else {
              this.showError('Erro ao verificar progresso em andamento.');
            }
          }
        } else {
          this.showError('Erro ao buscar informações do docente.');
        }
      }

      console.log(this.emAndamento);
      console.log(this.docente.pontuacaoAssiduidade);
    } catch (error) {
      this.showError('Erro ao buscar informações do docente.');
    }
  }

  async iniciarProgressao() {
    try {
      const progressaoData = {
        servidorId: this.docente.id,
        data: new Date(),
        tipo: 'ASSIDUIDADE',
        aprovado: null, // Define o status de aprovação inicial
        detalhes: 'Progressão por assiduidade',
        aprovadoPor: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      const response = await this.progressaoService.createProgressao(progressaoData);
      this.emAndamento = true;

      if (!response.error) {
        this.showSuccess('Progressão iniciada com sucesso!');
      } else {
        this.showError('Erro ao iniciar a progressão.');
      }
    } catch (error) {
      this.showError('Erro ao iniciar a progressão.');
    }
  }

  verDocumento(): void {
    this.documentoService.getDocumentoCaminho(4).subscribe(
      (response) => {
        if (response.caminho) {
          const pdfUrl = `${environment.docsApiURL}${response.caminho}`;
          window.open(pdfUrl, '_blank');
        } else {
          console.error('Caminho do documento não encontrado.');
        }
      },
      (error) => console.error('Erro ao carregar o documento:', error),
    );
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
