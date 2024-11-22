import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LancarTitulosComponent } from './lancar-titulos.component'; // Nome atualizado do componente
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'; // Adicionando módulo para dropdown
import { CalendarModule } from 'primeng/calendar'; // Adicionando módulo para calendário

@NgModule({
  declarations: [LancarTitulosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    DropdownModule, // Importando módulo de dropdown
    CalendarModule, // Importando módulo de calendário
  ],
  providers: [MessageService],
  exports: [LancarTitulosComponent],
})
export class LancarTitulosModule {}
