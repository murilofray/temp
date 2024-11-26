import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Importações do PrimeNG
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast'; // Importa o ToastModule
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    NgxMaskDirective,
    CommonModule,
    ButtonModule,
    SidebarModule,
    FormsModule,
    RouterModule,
    CardModule,
    DialogModule,
    ToolbarModule,
    ToastModule,
    TooltipModule,
  ],
  exports: [HomeComponent],
  providers: [
    provideNgxMask(), // Configura o ngx-mask
  ],
})
export class HomeModule {}
