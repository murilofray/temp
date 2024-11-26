import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService, ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RippleModule } from "primeng/ripple";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { ServicoPesquisaPrecoComponent } from "./servico-pesquisa-preco.component";
import { PdfViewerComponent } from "src/app/comum/pdf-viewer/pdf-viewer.component";

@NgModule({
  declarations: [ServicoPesquisaPrecoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    TableModule,
    RippleModule,
    ToolbarModule,
    TooltipModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    DialogModule,
    ConfirmDialogModule,
    PdfViewerComponent,
  ],
  providers: [MessageService, ConfirmationService],
  exports: [ServicoPesquisaPrecoComponent],
})
export class ServicoPesquisaPrecoModule {}
