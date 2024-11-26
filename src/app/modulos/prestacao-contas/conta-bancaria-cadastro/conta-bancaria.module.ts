import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContaBancariaComponent } from './conta-bancaria.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ContaBancariaComponent],
  imports: [CommonModule, FormsModule, ToastModule, DialogModule, ButtonModule],
  providers: [MessageService],
  exports: [ContaBancariaComponent],
})
export class ContaBancariaModule {}
