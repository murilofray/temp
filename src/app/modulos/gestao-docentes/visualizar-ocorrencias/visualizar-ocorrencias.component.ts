import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table'; // Importando o módulo Table
import { ButtonModule } from 'primeng/button'; // Importando o módulo Button
import { DropdownModule } from 'primeng/dropdown'; // Importando o módulo Dropdown
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { jwtDecode } from 'jwt-decode';
import { AbonoService } from '../services/abono.service';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { DocumentoService } from '../services/documento.service';
import { environment } from 'src/environments/environment';


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
  ocorrencias: any;
  abonos: any;
  abonosNomes: any;
  abonosMap: { [id: number]: any } = {};
  professores: any;
  docFile: File | null = null;
  atestadoFile: File | null = null;


  constructor(
    private messageService: MessageService,
    private ocorrenciaService: OcorrenciaService,
    private abonoService: AbonoService,
    private servidorService: ServidorService,
    private formBuilder: FormBuilder,
    private documentoService: DocumentoService,
    private cdr: ChangeDetectorRef // Injetar ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);

    this.abonoService.index().then((data) => {
      this.abonos = data;
    });

    this.servidorService.buscarServidoresPorEscola(decodedToken.servidor.escolaId).then((data) => {
      this.professores = data;
    });

    this.ocorrenciaService.buscarOcorrenciasDoServidor(decodedToken.servidor.id).then((data) => {
      this.ocorrencias = data;
    });
  }
  carregarOcorrencias() {
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
  
    this.ocorrenciaService
      .buscarOcorrenciasDoServidor(decodedToken.servidor.id)
      .then((data) => {
        this.ocorrencias = data;
        this.cdr.detectChanges(); // Forçar atualização da view
      })
      .catch((error) => {
        console.error('Erro ao carregar ocorrências:', error);
      });
  }

  buscarDocente(id: any): string {
    let profEncontrado = null;
    this.professores.forEach((prof) => {
      if (prof.id == id) {
        profEncontrado = prof;
      }
    });
    return profEncontrado.nome;
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

  buscarNomeAbono(id: any): string {
    let abona = '';
    this.abonos.forEach((abono) => {
      if (abono.id == id) {
        abona = abono.nome;
      }
    });
    return abona;
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

  salvar() {
    try{
      if (this.selectedAbono) {
        if (this.selectedAbono.nome == 'Injustificada') {
          this.justificarOcorrencia(this.selectedAbono);
        } else {
          if (this.contarOcorrenciasDoAno(this.selectedAbono)<this.selectedAbono.maximoDiasAno||this.selectedAbono.maximoDiasAno==0) {
            if (this.contarOcorrenciasDoMes(this.selectedAbono)<this.selectedAbono.maximoDiasMes||this.selectedAbono.maximoDiasMes==0) {
              if(this.atestadoFile){
                this.justificarOcorrencia(this.selectedAbono.id);
              } else {
                this.mostrarMensagem('Aviso', 'Selecione o atestado!','warn')
              }
            } else {
              this.mostrarMensagem('Aviso', 'Você já esgotou esse tipo de abono para esse mês.', 'warn');
            }
          } else {
            this.mostrarMensagem('Aviso', 'Você já esgotou esse tipo de abono para esse ano.', 'warn');
          }
        }
      } else {
        this.mostrarMensagem('Aviso', 'Selecione um tipo de abono.', 'warn');
      }
    } catch(erro){
      this.mostrarMensagem("Erro","Erro ao justificar ocorrência", 'error');
    }
    
  }

  justificarOcorrencia(idAbono: number) {
    try {
      // UPLOAD DO ATESTADO

      if (this.atestadoFile) {
        const formData = new FormData();

        formData.append('caminho', 'atestados/');        
        formData.append('pdf', this.atestadoFile);
        formData.append('tipoDocumentoId', '8');

        // Upload do documento
        this.documentoService.createDocumentoScan(formData).subscribe(
          (response) => {
            
            // Sucesso no upload
            const ocorrencia: any = {
              id: this.selectedOcorrencia.id,
              servidorId: this.selectedOcorrencia.servidorId,
              abonoId: idAbono,
              lancadoPor: this.selectedOcorrencia.lancadoPor,
              status: "Não avaliada",
              dataOcorrencia: this.selectedOcorrencia.dataOcorrencia,
              descricao: this.selectedOcorrencia.descricao,
              motivo: this.selectedOcorrencia.motivo,
              documentoScanId: response.id,
              aprovadoPor: null,
              updatedAt: new Date()
            }
            
            this.ocorrenciaService.editarOcorrencia(ocorrencia);

            this.mostrarMensagem("Sucesso","Ocorrência justificada com sucesso",'success');

            window.location.reload();
            this.displayDialogJustificar = false;

            this.selectedAbono = null;
            this.atestadoFile = null;
          },
          (error) => console.error('Erro ao fazer upload do documento:', error),
        );
      } else {
        console.error('Nenhum arquivo selecionado');
      }



    } catch (error) {
      this.mostrarMensagem('Erro', error, 'error');
    }
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.atestadoFile = file;
    }
  }

  async downloadDocumento(caminho: string) {
    const response = await this.documentoService.downloadPDF(caminho);
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
  /*verDocumento(): void {
    this.documentoService.getDocumentoCaminho(this.selectedOcorrencia.documentoScanId).subscribe(
      (response) => {
        if (response.caminho) {
          const pdfUrl = `${environment.apiUrl}/docs/${response.caminho}`;
          window.open(pdfUrl, '_blank');
        } else {
          console.error('Caminho do documento não encontrado.');
        }
      },
      (error) => console.error('Erro ao carregar o documento:', error),
    );
  }*/
  
  contarOcorrenciasDoMes(abonoId: string): number {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
  
    let contador = 0;
    for (const ocorrencia of this.ocorrencias) {
      const dataOcorrencia = new Date(ocorrencia.data);
      if (
        ocorrencia.abonoId === abonoId &&
        dataOcorrencia.getFullYear() === anoAtual &&
        dataOcorrencia.getMonth() === mesAtual
      ) {
        contador++;
      }
    }
    return contador;
  }
  
  contarOcorrenciasDoAno(abonoId: string): number {
    const anoAtual = new Date().getFullYear();
  
    let contador = 0;
    for (const ocorrencia of this.ocorrencias) {
      const dataOcorrencia = new Date(ocorrencia.data);
      if (
        ocorrencia.abonoId === abonoId &&
        dataOcorrencia.getFullYear() === anoAtual
      ) {
        contador++;
      }
    }
    return contador;
  }
  
  mostrarMensagem(titulo: string, detalhe: string, tipo: 'success' | 'info' | 'warn' | 'error') {
    this.messageService.add({ severity: tipo, summary: titulo, detail: detalhe, life: 3000 });
  }
}
