import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { GerenciarTurmaQuestionarioComponent } from './gerenciar-turma-questionario.component'; // Importando o componente

@NgModule({
  declarations: [
    GerenciarTurmaQuestionarioComponent, // Declare o componente aqui
  ],
  imports: [BrowserModule, BrowserAnimationsModule, TableModule, ButtonModule, DropdownModule],
})
export class GerenciarTurmaQuestionarioModule {}

