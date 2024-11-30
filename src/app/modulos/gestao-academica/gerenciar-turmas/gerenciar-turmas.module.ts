import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';



@NgModule({
  declarations: [],
  imports: [CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, ReactiveFormsModule, DividerModule],
  providers: [MessageService],
})
export class GerenciarTurmasModule { }
