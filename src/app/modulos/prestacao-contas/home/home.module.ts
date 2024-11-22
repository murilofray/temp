import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';

// Importações do PrimeNG
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, ButtonModule, SidebarModule, FormsModule, RouterModule, CardModule, DialogModule, ToolbarModule],
  exports: [HomeComponent],
})
export class HomeModule {}
