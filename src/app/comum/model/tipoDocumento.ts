import { TipoDocumentoEnum } from "src/app/enums/TipoDocumentoEnum";
import { DocumentoScan } from "./documentoScan";

export interface TipoDocumento {
    id: number;
    descricao: TipoDocumentoEnum;
    DocumentosScan?: DocumentoScan[];
  }
