import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { LancarQuestionarioAlunoComponent } from './lancar-questionario-aluno.component'; // Importando o componente
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmDialog } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    LancarQuestionarioAlunoComponent,
    // Declare o componente aqui
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    InputMaskModule,
    ConfirmDialog,
  ],
  providers: [],
})
export class LancarQuestionarioAlunoModule {}

