import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class MergePDFService {
  constructor() {}

  async mergePDFs(pdfGerados: any[]) {
    const mergedPdf = await PDFDocument.create();
  }
}
