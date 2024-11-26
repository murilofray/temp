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
import { ListaPesquisaPrecosComponent } from './lista-pesquisa-precos.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListaPesquisaPrecosComponent],
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
    DropdownModule,
    InputTextModule,
  ],
  providers: [MessageService],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListaPesquisaPrecosModule {}
