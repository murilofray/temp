import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';



@NgModule({
  declarations: [],
  imports: [CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, ReactiveFormsModule, RadioButtonModule],
  providers: [MessageService],
})
export class RealizarTransferenciaModule { }
