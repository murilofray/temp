import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AbonoService } from '../services/abono.service';
import { TableModule } from 'primeng/table'; // Importando o módulo de tabelas
import { CheckboxModule } from 'primeng/checkbox'; // Importando o módulo CheckboxModule
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; // Importação do módulo Toast

@Component({
  selector: 'app-gerenciar-abono',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, TableModule, FormsModule,CheckboxModule, ToastModule],
  providers: [MessageService],
  templateUrl: './gerenciar-abono.component.html',
  styleUrls: ['./gerenciar-abono.component.scss'],
})
export class GerenciarAbonoComponent implements OnInit {
  abonos: any[] = [];
  abonosFiltrados: any[] = [];
  abonoSelecionado: any = {
    id: null,
    nome: '',
    maximoDiasAno: 0,
    maximoDiasMes: 0,
    abona: true,
    semLimiteAno: true,
    semLimiteMes: true,
  };
  exibirDialog = false;
  carregando = true;
  novoRegistro = false;

  // Controle para Criar Categoria
  isModalCategoriaOpen = false; // Modal de criação de categoria
  categoriaForm: any = { nome: '' }; // Dados do formulário de categoria

  constructor(private abonoService: AbonoService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.carregarAbonos();
  }

  async carregarAbonos(): Promise<void> {
    try {
      const dados = await this.abonoService.index();
      this.abonos = dados || [];
      this.abonosFiltrados = [...this.abonos];
    } catch (erro) {
      console.error('Erro ao carregar abonos:', erro);
    } finally {
      this.carregando = false;
    }
  }

  filtrarAbonos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.abonosFiltrados = this.abonos.filter((abono) =>
      abono.nome.toLowerCase().includes(valor)
    );
  }

  abrirDialog(abono?: any): void {
    if (abono) {
      this.abonoSelecionado = {
        ...abono,
        semLimiteAno: abono.maximoDiasAno === 0,
        semLimiteMes: abono.maximoDiasMes === 0,
      };
      this.novoRegistro = false;
    } else {
      this.abonoSelecionado = {
        id: null,
        nome: '',
        maximoDiasAno: 0,
        maximoDiasMes: 0,
        abona: true,
        semLimiteAno: true,
        semLimiteMes: true,
      };
      this.novoRegistro = true;
    }
    this.exibirDialog = true;
  }

  fecharDialog(): void {
    this.exibirDialog = false;
    this.erroForm = null;
    this.abonoSelecionado = {
      id: null,
      nome: '',
      maximoDiasAno: 0,
      maximoDiasMes: 0,
      abona: true,
      semLimiteAno: true,
      semLimiteMes: true,
    };
  }

  erroForm: string | null = null;

  async salvarAbono(): Promise<void> {
    try {
      // Validações de dias negativos
      if (this.abonoSelecionado.maximoDiasAno < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor de Máximo Dias/Ano não pode ser negativo.' });
        return;
      }
  
      if (this.abonoSelecionado.maximoDiasMes < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor de Máximo Dias/Mês não pode ser negativo.' });
        return;
      }
  
      // Ajusta valores para "Sem Limite"
      if (this.abonoSelecionado.semLimiteAno) {
        this.abonoSelecionado.maximoDiasAno = 0;
      }
      if (this.abonoSelecionado.semLimiteMes) {
        this.abonoSelecionado.maximoDiasMes = 0;
      }
  
      let resposta;
  
      if (this.novoRegistro) {
        resposta = await this.abonoService.criarAbono(
          this.abonoSelecionado.nome,
          this.abonoSelecionado.abona,
          this.abonoSelecionado.maximoDiasAno,
          this.abonoSelecionado.maximoDiasMes
        );
      } else {
        resposta = await this.abonoService.editarAbono(
          this.abonoSelecionado.id,
          this.abonoSelecionado.nome,
          this.abonoSelecionado.abona,
          this.abonoSelecionado.maximoDiasAno,
          this.abonoSelecionado.maximoDiasMes
        );
      }
  
      if (resposta?.error || resposta?.mensagem) {
        const mensagemErro = resposta.error || resposta.mensagem;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagemErro });
        return;
      }
  
      this.carregarAbonos();
      this.fecharDialog();
    } catch (erro) {
      console.error('Erro inesperado ao salvar abono:', erro);
      this.messageService.add({ severity: 'error', summary: 'Erro inesperado', detail: 'Tente novamente.' });
    }
  }
  
  
  


  // Métodos para o Modal de Categoria
  abrirModalCategoria(): void {
    this.isModalCategoriaOpen = true;
    this.categoriaForm = {
      nome: '',
      maximoDiasAno: 0,
      maximoDiasMes: 0,
      semLimiteAno: true,
      semLimiteMes: true,
    };
  }

  fecharModalCategoria(): void {
    this.isModalCategoriaOpen = false;
    this.erroForm = null;
  }

  async criarCategoria(): Promise<void> {
    // Validações de valores negativos
    if (this.categoriaForm.maximoDiasAno < 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor de Máximo Dias/Ano não pode ser negativo.' });
      return;
    }

    if (this.categoriaForm.nome === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome da categoria deve ser preenchido.' });
      return;
    }
  
    if (this.categoriaForm.maximoDiasMes < 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor de Máximo Dias/Mês não pode ser negativo.' });
      return;
    }
  
    try {
      const maximoDiasAno = this.categoriaForm.semLimiteAno ? 0 : this.categoriaForm.maximoDiasAno;
      const maximoDiasMes = this.categoriaForm.semLimiteMes ? 0 : this.categoriaForm.maximoDiasMes;
  
      let resposta = await this.abonoService.criarAbono(
        this.categoriaForm.nome,
        this.abonoSelecionado.abona,
        maximoDiasAno,
        maximoDiasMes
      );
  
      if (resposta?.error) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Já existe uma categoria com esse nome" });
        return;
      }
  
      this.fecharModalCategoria();
      this.carregarAbonos();
    } catch (erro) {
      console.error('Erro ao criar categoria:', erro);
      this.messageService.add({ severity: 'error', summary: 'Erro inesperado', detail: 'Tente novamente.' });
    }
  }
  

  async deletarAbono(id: number): Promise<void> {
    try {
      const resposta = await this.abonoService.deletarAbono(id);
      if (resposta.error) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar abono' });
        return;
      }
      this.carregarAbonos();
    } catch (erro) {
      console.error('Erro ao deletar abono:', erro);
      this.messageService.add({ severity: 'error', summary: 'Erro inesperado', detail: 'Tente novamente.' });
    }
  }
  
}
