import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-apms',
  standalone: true,
  imports: [CommonModule, TableModule, ToolbarModule, ButtonModule],
  templateUrl: './lista-apms.component.html',
  styleUrl: './lista-apms.component.scss'
})
export class ListaApmsComponent {

  constructor(private router: Router) { }

}
