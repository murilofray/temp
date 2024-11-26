import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { GerenciarQuestionarioAlunoComponent } from './gerenciar-questionario-aluno.component'; // Importando o componente
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    GerenciarQuestionarioAlunoComponent, // Declare o componente aqui
  ],
  imports: [BrowserModule, BrowserAnimationsModule, TableModule, ButtonModule, DropdownModule],
})
export class GerenciarQuestionarioAlunoModule {}

