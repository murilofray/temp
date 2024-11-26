import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerenciarAlergiasComponent } from './gerenciar-alergias.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [GerenciarAlergiasComponent],
  imports: [CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  providers: [MessageService],
})
export class GerenciarAlergiasModule {}
