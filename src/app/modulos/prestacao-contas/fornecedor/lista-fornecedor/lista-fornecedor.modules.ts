import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { ListaFornecedorComponent } from './lista-fornecedor.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListaFornecedorComponent],
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
    DialogModule,
    InputMaskModule,
    InputTextModule,
  ],
  providers: [MessageService],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListaFornecedorModule {}
