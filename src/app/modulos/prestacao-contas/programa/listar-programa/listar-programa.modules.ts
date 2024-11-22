import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ListarProgramaComponent } from './listar-programa.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [ListarProgramaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    RippleModule,
    ToolbarModule,
    DialogModule,
  ],
  providers: [MessageService],
  exports: [ListarProgramaComponent],
})
export class ListarProgramaModule {}
