import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TableModule,
    RippleModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DialogModule,
    ToolbarModule,
  ],
  providers: [MessageService],
  exports: [],
})
export class BemConsolidarProponenteModule {}
