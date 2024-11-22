import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CadastrarServidorComponent } from './cadastrar-servidor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [CadastrarServidorComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputMaskModule,
    PasswordModule,
    CalendarModule,
    InputNumberModule,
  ],
  providers: [MessageService],
})
export class CadastrarServidorModule {}
