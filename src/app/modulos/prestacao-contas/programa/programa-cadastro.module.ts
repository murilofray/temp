import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramaCadastroComponent } from './programa-cadastro.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ProgramaCadastroComponent],
  imports: [CommonModule, FormsModule, ToastModule, ButtonModule],
  providers: [MessageService],
  exports: [ProgramaCadastroComponent],
})
export class ProgramaCadastroModule {}
