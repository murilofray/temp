import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, DialogModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  displayDialog: boolean = false;
  pdfUrl: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  showPdf(url: string) {
    this.pdfUrl = url;
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.pdfUrl = ''; // Limpar URL ao fechar
  }
}
