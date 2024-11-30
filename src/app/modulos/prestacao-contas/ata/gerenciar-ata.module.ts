import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { GerenciarAtaComponent } from './gerenciar-ata.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
  declarations: [GerenciarAtaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    ToolbarModule,
    TooltipModule,
    EditorModule,
    FileUploadModule
  ],
  providers: [MessageService],
  exports: [GerenciarAtaComponent],
})
export class GerenciarAtaModule {}
