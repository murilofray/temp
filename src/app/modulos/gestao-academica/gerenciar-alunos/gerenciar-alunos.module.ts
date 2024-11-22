import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { GerenciarAlunosComponent } from './gerenciar-alunos.component';

@NgModule({
  declarations: [GerenciarAlunosComponent],
  imports: [BrowserModule, BrowserAnimationsModule, TableModule, ButtonModule, DropdownModule],
})
export class GerenciarAlunosModule {}
