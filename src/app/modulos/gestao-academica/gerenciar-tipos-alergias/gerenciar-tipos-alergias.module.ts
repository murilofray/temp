import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerenciarTiposAlergiasComponent } from './gerenciar-tipos-alergias.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [GerenciarTiposAlergiasComponent],
  imports: [CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  providers: [MessageService],
})
export class GerenciarTiposAlergiasModule {}
