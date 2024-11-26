import { Injectable } from '@angular/core';
import { ViaCepService } from '../cep/via-cep.service';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    constructor(private viaCepService: ViaCepService) { }

    validarDataNascimento(dataNascimento: any): boolean {
        const dataAtual = new Date();
        if (dataNascimento > dataAtual) {
            return false;
        }
        return true;
    };

    validarCpf(cpf: string): boolean {
        cpf = cpf.replace(/[\s.-]*/igm, '')
        if (
            !cpf ||
            cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999"
        ) {
            return false
        }
        var soma = 0
        var resto
        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11)) resto = 0
        if (resto != parseInt(cpf.substring(9, 10))) return false
        soma = 0
        for (var i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11)) resto = 0
        if (resto != parseInt(cpf.substring(10, 11))) return false
        return true
    }

    isRA(ra: string): boolean {
        const raRegex = /^\d{3}\.\d{3}\.\d{3}\.\d{3}-[A-Z0-9]$/i;
        return raRegex.test(ra);
    }

    validarCep(cepControl: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (cepControl) {
                const cep = cepControl.value.replace(/\D/g, ''); // Remove caracteres não numéricos do CEP
                if (cep.length === 8) {
                    this.viaCepService.validarCep(cep).subscribe(
                        (resposta) => {
                            if (!resposta.erro) {
                                // Retorna os dados do CEP se for válido
                                resolve({
                                    logradouro: resposta.logradouro,
                                    bairro: resposta.bairro,
                                    cidade: resposta.localidade,
                                    uf: resposta.uf
                                });
                            } else {
                                // Rejeita a Promise com um erro
                                reject('CEP não encontrado ou inválido.');
                            }
                        },
                        (erro) => {
                            // Rejeita a Promise com um erro
                            reject('Erro ao buscar CEP. Tente novamente.');
                            console.log(erro);
                        }
                    );
                } else {
                    // Rejeita a Promise com um erro
                    reject('CEP inválido. Por favor, insira um CEP com 8 dígitos.');
                }
            } else {
                // Rejeita a Promise se o controle do CEP não for válido
                reject('CEP não fornecido.');
            }
        });
    }
}