import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  private urlBase = `${environment.apiUrl}/tipo-doc`;

  constructor() { }

  async index() {
    const resposta = await axios.get(this.urlBase);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getTipoDocIds() {

    const resposta = await axios.get(this.urlBase);
    if (resposta.status === 200) {
      const tiposDocumento = resposta.data;
      const certidaoNascimentoId = tiposDocumento.find(doc => doc.descricao === "CERTIDAO_NASCIMENTO")?.id;
      const nisId = tiposDocumento.find(doc => doc.descricao === "NIS")?.id;
      const rgId = tiposDocumento.find(doc => doc.descricao === "RG")?.id;
      const cpfId = tiposDocumento.find(doc => doc.descricao === "CPF")?.id;
      const declaracaoVacinacaoId = tiposDocumento.find(doc => doc.descricao === "DECLARACAO_VACINACAO")?.id;
      const comprovanteResidenciaId = tiposDocumento.find(doc => doc.descricao === "COMPROVANTE_RESIDENCIA")?.id;
      const autodeclaracaoRacialId = tiposDocumento.find(doc => doc.descricao === "AUTODECLARACAO_RACIAL")?.id;
      const documentosResponsavelId = tiposDocumento.find(doc => doc.descricao === "DOCUMENTO_DO_RESPONSAVEL")?.id;
      const laudoId = tiposDocumento.find(doc => doc.descricao === "LAUDO")?.id;

      return {
        certidaoNascimento: certidaoNascimentoId,
        nis: nisId,
        rg: rgId,
        cpf: cpfId,
        declaracaoVacinacao: declaracaoVacinacaoId,
        comprovanteResidencia: comprovanteResidenciaId,
        autodeclaracaoRacial: autodeclaracaoRacialId,
        documentosResponsavel: documentosResponsavelId,
        laudo: laudoId
      };
    }
    return resposta.status;
  }

  async getById(id: number) {
    const resposta = await axios.get(`${this.urlBase}/${id}`);

    if (resposta.status === 200) {
      return resposta.data;
    }
  }

  async getTiposDocumento() {
    try {
      const resposta = await axios.get(this.urlBase);
      if (resposta.status === 200) {
        return resposta.data
          .filter((doc: { descricao: string }) =>
            ["LAUDO", "CERTIDAO_NASCIMENTO", "NIS", "RG", "CPF", "DECLARACAO_VACINACAO", "COMPROVANTE_RESIDENCIA", "DOCUMENTO_DO_RESPONSAVEL", "AUTODECLARACAO_RACIAL"].includes(doc.descricao)
          )
          .map((doc: { id: number; descricao: string }) => {
            let descricaoFormatada = '';
            switch (doc.descricao) {
              case 'CERTIDAO_NASCIMENTO':
                descricaoFormatada = 'Certidão de nascimento';
                break;
              case 'NIS':
                descricaoFormatada = 'Número de Identificação Social';
                break;
              case 'LAUDO':
                descricaoFormatada = 'Laudo';
                break;
              case 'DECLARACAO_VACINACAO':
                descricaoFormatada = 'Declaração de vacinação';
                break;
              case 'COMPROVANTE_RESIDENCIA':
                descricaoFormatada = 'Comprovante de residência';
                break;
              case 'DOCUMENTO_DO_RESPONSAVEL':
                descricaoFormatada = 'Documento do responsável';
                break;
              case 'AUTODECLARACAO_RACIAL':
                descricaoFormatada = 'Autodeclaração racial';
                break;
              default:
                descricaoFormatada = doc.descricao;
            }
            return { id: doc.id, descricao: descricaoFormatada };
          });
      } else {
        throw new Error(`Erro tipos de documentos: ${resposta.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar tipos de documentos.');
    }
  }
}
