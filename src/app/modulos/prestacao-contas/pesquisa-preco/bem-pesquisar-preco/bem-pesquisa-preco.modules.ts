import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BemPesquisaPrecoComponent } from './bem-pesquisa-preco.component';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { SafeUrlPipe } from 'src/app/comum/pdf-viewer/safe-url.pipe';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
  declarations: [BemPesquisaPrecoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TableModule,
    RippleModule,
    ToolbarModule,
    TooltipModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    DialogModule,
    ConfirmDialogModule,
    PdfViewerComponent,
  ],
  providers: [MessageService, ConfirmationService],
  exports: [BemPesquisaPrecoComponent],
})
export class BemPesquisaPrecoModule {}
