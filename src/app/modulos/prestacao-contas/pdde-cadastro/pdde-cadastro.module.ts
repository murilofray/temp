import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PddeCadastroComponent } from './pdde-cadastro.component';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [PddeCadastroComponent],
  imports: [CommonModule, FormsModule, ToastModule, DialogModule, ButtonModule],
  providers: [MessageService],
  exports: [PddeCadastroComponent],
})
export class PddeCadastroModule {}
