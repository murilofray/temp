import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ListarMovimentacaoComponent } from './listar-movimentacao.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { PdfViewerComponent } from 'src/app/comum/pdf-viewer/pdf-viewer.component';
import { SafeUrlPipe } from 'src/app/comum/pdf-viewer/safe-url.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [ListarMovimentacaoComponent, SafeUrlPipe],
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    RippleModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CalendarModule,
    ToolbarModule,
    TooltipModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    FileUploadModule,
    PdfViewerComponent
  ],
  providers: [MessageService, ConfirmationService],
  exports: [ListarMovimentacaoComponent, SafeUrlPipe],
})
export class ListarMovimentacaoModule {}
