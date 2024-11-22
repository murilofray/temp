import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SafeUrlPipe } from 'src/app/comum/pdf-viewer/safe-url.pipe';

@NgModule({
  declarations: [SafeUrlPipe],

  providers: [MessageService],
})
export class ListarOfiMemModule {}
