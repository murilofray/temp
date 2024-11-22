import { Component } from '@angular/core';
import { DocumentoService } from '../services/documento.service'; // Serviço para gerenciar documentos
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-subir-tabela',
  templateUrl: './subir-tabela.component.html',
  styleUrls: ['./subir-tabela.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
})
export class SubirTabelaComponent {
  selectedFile: File | null = null; // Arquivo selecionado

  constructor(private documentoService: DocumentoService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('pdf', this.selectedFile);
      formData.append('tipoDocumentoId', '1');

      // Upload do documento
      this.documentoService.createDocumentoScan(formData).subscribe(
        () => {
          // Sucesso no upload
          console.log('Arquivo enviado com sucesso!');
          this.selectedFile = null; // Reseta o arquivo selecionado
        },
        (error) => console.error('Erro ao fazer upload do documento:', error),
      );
    } else {
      console.error('Nenhum arquivo selecionado');
    }
  }

  verDocumento(): void {
    this.documentoService.getDocumentoCaminho(5).subscribe(
      (response) => {
        if (response.caminho) {
          const pdfUrl = `http://localhost:3333/docs/${response.caminho}`;
          window.open(pdfUrl, '_blank');
        } else {
          console.error('Caminho do documento não encontrado.');
        }
      },
      (error) => console.error('Erro ao carregar o documento:', error),
    );
  }
}
