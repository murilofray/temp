import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { LancarEscolasComponent } from './lancar-escolas.component'; // Importando o componente
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [
    LancarEscolasComponent,
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
  ],
  providers: [],
})
export class LancarEscolasModule {}

