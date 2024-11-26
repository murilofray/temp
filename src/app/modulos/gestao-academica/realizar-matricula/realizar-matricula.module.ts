import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [],
  imports: [CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  providers: [MessageService],
})
export class RealizarMatriculaModule { }
