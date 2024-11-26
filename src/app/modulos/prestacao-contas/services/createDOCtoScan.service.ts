import { Injectable } from '@angular/core';
import { TipoDocumentoEnum } from 'src/app/enums/TipoDocumentoEnum';
import { DocumentoService } from './documento.service';

@Injectable({
  providedIn: 'root',
})
export class CreateDOCtoScanService {
  constructor(private documentoService: DocumentoService) {}

  async createDOCandUpload(arquivoPDF: File, tde: TipoDocumentoEnum) {
    const formData = new FormData();
    formData.append('caminho', tde.caminho);
    formData.append('tipoDocumentoId', tde.id.toString());
    formData.append('pdf', arquivoPDF as File);

    try {
      const respostaDOC = await this.documentoService.create(formData);
      return respostaDOC;
    } catch (error) {
      throw error;
    }
  }
}
