import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestacaoContasComponent } from './prestacao-contas.component';

const routes: Routes = [
  {
    path: '',
    component: PrestacaoContasComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrestacaoContasRoutingModule {}
