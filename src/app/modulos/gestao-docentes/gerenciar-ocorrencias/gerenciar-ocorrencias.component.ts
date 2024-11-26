import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { DocenteService } from '../services/docente.service';
import { ServidorService } from '../services/servidor.service';
import {jwtDecode} from 'jwt-decode';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DocumentoService } from '../services/documento.service';
import { environment } from 'src/environments/environment';

export interface Ocorrencia {
  id: number;
  servidorId?: number;
  documentoScanId?: number;
  abonoId?: number;
  lancadoPor?: number;
  dataOcorrencia?: Date;
  descricao?: string;
  motivo?: string;
  aprovadoPor?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  servidorNome?: string;
  servidorEscolaId?: number;
  aprovadoPorNome?: string;
}

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
  selector: 'app-gerenciar-ocorrencias',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    InputTextareaModule,
  ],
  templateUrl: './gerenciar-ocorrencias.component.html',
  styleUrls: ['./gerenciar-ocorrencias.component.scss'],
})
export class GerenciarOcorrenciasComponent implements OnInit {
  displayDialog: boolean = false;
  selectedOcorrencia: Ocorrencia | null = null;
  ocorrencias: Ocorrencia[] = [];
  filteredOcorrencias: Ocorrencia[] = [];
  servidorLogadoId: number | null = null;
  servidorLogadoEscola: number | null = null;
  servidorLogadoNome: string | null = null;
  nivelAcessoServidor: any[] = [];
  statusSelecionado: string | null = null;
  mostrarDeletados: boolean = false;
  displayJustificarRecusaDialog: boolean = false;
  motivoRecusa: string = '';
  ocorrenciaParaRecusar: Ocorrencia | null = null;
  displayJustificarExclusaoDialog: boolean = false;
  motivoExclusao: string = '';
  ocorrenciaParaExcluir: Ocorrencia | null = null;

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private docenteService: DocenteService,
    private servidorService: ServidorService,
    private documentoService: DocumentoService
  ) {}

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    if (tokenJWT) {
      const decodedToken: JwtPayload = jwtDecode(tokenJWT);
      this.servidorLogadoId = decodedToken.servidor.id;
      this.servidorLogadoEscola = decodedToken.servidor.escolaId;
      this.servidorLogadoNome = decodedToken.servidor.nome;
      this.nivelAcessoServidor = decodedToken.servidor.NivelAcessoServidor;
    }

    await this.carregarOcorrencias();
  }

  showDialog(ocorrencia: Ocorrencia) {
    this.selectedOcorrencia = ocorrencia;
    this.displayDialog = true;
  }

  filterOcorrencias(event: any) {
    const query = event.target.value.toLowerCase().trim();

    this.filteredOcorrencias = this.ocorrencias.filter(
      (ocorrencia) =>
        ocorrencia.servidorNome?.toLowerCase().includes(query)
    );
  }

  abrirDialogoRecusa(ocorrencia: Ocorrencia) {
    this.ocorrenciaParaRecusar = ocorrencia;
    this.motivoRecusa = ''; // Limpa o motivo anterior
    this.displayJustificarRecusaDialog = true;
  }

  abrirDialogoExclusao(ocorrencia: Ocorrencia) {
    this.ocorrenciaParaExcluir = ocorrencia;
    this.motivoExclusao = ''; // Limpa o motivo anterior
    this.displayJustificarExclusaoDialog = true;
  }
  
  

  async abonarOcorrencia(ocorrencia: Ocorrencia) {
    try {
      const resposta = await this.ocorrenciaService.atualizarStatusOcorrencia(
        ocorrencia.id,
        'Aceita',
        this.servidorLogadoId
      );
      if (!resposta.error) {
        ocorrencia.status = 'Aceita';
        ocorrencia.aprovadoPor = this.servidorLogadoId;
        ocorrencia.aprovadoPorNome = this.servidorLogadoNome;
        await this.atualizarListaOcorrencias();
      } else {
        console.error('Erro ao aceitar ocorrência:', resposta.data);
      }
    } catch (error) {
      console.error('Erro ao aceitar ocorrência:', error);
    }
  }

  async confirmarRecusa() {
    if (this.ocorrenciaParaRecusar && this.motivoRecusa) {
      try {
        const resposta = await this.ocorrenciaService.atualizarStatusOcorrencia(
          this.ocorrenciaParaRecusar.id,
          'Recusada',
          this.servidorLogadoId,
          this.motivoRecusa // Envia o motivo para o serviço
        );
        if (!resposta.error) {
          this.ocorrenciaParaRecusar.status = 'Recusada';
          this.ocorrenciaParaRecusar.aprovadoPor = this.servidorLogadoId;
          this.ocorrenciaParaRecusar.aprovadoPorNome = this.servidorLogadoNome;
          this.ocorrenciaParaRecusar.motivo = this.motivoRecusa; // Atualiza localmente
          console.log('Ocorrência recusada com sucesso:', resposta.data);
          await this.atualizarListaOcorrencias();
          this.displayJustificarRecusaDialog = false;
        } else {
          console.error('Erro ao recusar ocorrência:', resposta.data);
        }
      } catch (error) {
        console.error('Erro ao recusar ocorrência:', error);
      }
    }
  }

  async confirmarExclusao() {
    if (this.ocorrenciaParaExcluir && this.motivoExclusao) {
      try {
        const resposta = await this.ocorrenciaService.atualizarStatusOcorrencia(
          this.ocorrenciaParaExcluir.id,
          'Excluida',
          this.servidorLogadoId,
          this.motivoExclusao // Envia o motivo para o serviço
        );
        if (!resposta.error) {
          this.ocorrenciaParaExcluir.status = 'Excluida';
          this.ocorrenciaParaExcluir.aprovadoPor = this.servidorLogadoId;
          this.ocorrenciaParaExcluir.aprovadoPorNome = this.servidorLogadoNome;
          this.ocorrenciaParaExcluir.motivo = this.motivoExclusao; // Atualiza localmente
          console.log('Ocorrência excluída com sucesso:', resposta.data);
          await this.atualizarListaOcorrencias();
          this.displayJustificarExclusaoDialog = false;
        } else {
          console.error('Erro ao excluir ocorrência:', resposta.data);
        }
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
      }
    }
  }
  

  async restaurarOcorrencia(ocorrencia: Ocorrencia) {
    try {
      const resposta = await this.ocorrenciaService.atualizarStatusOcorrencia(
        ocorrencia.id,
        'Não Avaliada',
        this.servidorLogadoId
      );
      if (!resposta.error) {
        ocorrencia.status = 'Não Avaliada';
        ocorrencia.aprovadoPor = this.servidorLogadoId;
        ocorrencia.aprovadoPorNome = this.servidorLogadoNome;
        console.log('Ocorrência restaurada com sucesso:', resposta.data);
        await this.atualizarListaOcorrencias();
      } else {
        console.error('Erro ao restaurar ocorrência:', resposta.data);
      }
    } catch (error) {
      console.error('Erro ao restaurar ocorrência:', error);
    }
  }

  async carregarOcorrencias() {
    try {
      const servidoresResponse = await this.servidorService.getAll();
      const servidores = servidoresResponse.data || [];
      const ocorrencias = await this.ocorrenciaService.index();
  
      // Mapeando as ocorrências com as informações necessárias
      this.ocorrencias = ocorrencias
        .filter((ocorrencia) => ocorrencia.status !== 'Não Justificada') // Filtra "Não Justificada"
        .map((ocorrencia) => {
          const servidor = servidores.find(
            (docente) => docente.id === ocorrencia.servidorId
          );
          const aprovador = servidores.find(
            (docente) => docente.id === ocorrencia.aprovadoPor
          );
          return {
            ...ocorrencia,
            servidorNome: servidor ? servidor.nome : 'Desconhecido',
            servidorEscolaId: servidor ? servidor.escolaId : null,
            aprovadoPorNome: aprovador ? aprovador.nome : 'Não Avaliada',
          };
        });
  
      // Aplicar a validação de nível de acesso
      if (!this.usuarioTemAcessoTotal()) {
        this.ocorrencias = this.ocorrencias.filter(
          (ocorrencia) =>
            ocorrencia.servidorEscolaId === this.servidorLogadoEscola
        );
      }
  
      // Atualiza as ocorrências filtradas
      this.filteredOcorrencias = [...this.ocorrencias];
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    }
  }
  

  async carregarOcorrenciasPorStatus(status: string | null) {
    this.statusSelecionado = status;
    await this.carregarOcorrencias();
    if (status) {
      this.ocorrencias = this.ocorrencias.filter(
        (ocorrencia) =>
          ocorrencia.status?.toLowerCase().trim() === status.toLowerCase().trim()
      );
    }
    this.filteredOcorrencias = [...this.ocorrencias];
  }

  usuarioTemAcessoTotal(): boolean {
    // Verifica se o usuário tem acesso total (Nível de Acesso 1)
    // Ajuste a lógica abaixo conforme a estrutura real do seu `NivelAcessoServidor`
    return this.nivelAcessoServidor.some(
      (nivel) => nivel.nivelAcessoId === 1
    );
  }

  async atualizarListaOcorrencias() {
    if (this.statusSelecionado) {
      await this.carregarOcorrenciasPorStatus(this.statusSelecionado);
    } else {
      await this.carregarOcorrencias();
    }
  }

  verDocumento(documentoScanId: number): void {
    if (documentoScanId) {
      this.documentoService.getDocumentoCaminho(documentoScanId).subscribe(
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
    } else {
      console.error('ID do documento escaneado não fornecido.');
    }
  }
}
