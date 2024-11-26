import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CategoriaCertificadoService } from '../services/categoria-certificado.service';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-gerenciar-categoria-certificado',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './gerenciar-categoria-certificado.component.html',
  styleUrls: ['./gerenciar-categoria-certificado.component.scss'],
})
export class GerenciarCategoriaCertificadoComponent implements OnInit {
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  categoriaSelecionada: any = {
    id: null,
    nome: '',
    pontosPorHora: null,
    horasMinimas: null,
    horasMaximas: null,
  };
  exibirDialog = false;
  carregando = true;
  novoRegistro = false;

  constructor(
    private categoriaService: CategoriaCertificadoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  async carregarCategorias(): Promise<void> {
    try {
      const resposta = await this.categoriaService.listarCategorias();
      this.categorias = resposta?.data || [];
      this.categoriasFiltradas = [...this.categorias];
    } catch (erro) {
      console.error('Erro ao carregar categorias:', erro);
    } finally {
      this.carregando = false;
    }
  }

  filtrarCategorias(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.categoriasFiltradas = this.categorias.filter((categoria) =>
      categoria.nome.toLowerCase().includes(valor)
    );
  }

  abrirDialog(categoria?: any): void {
    if (categoria) {
      this.categoriaSelecionada = { ...categoria };
      this.novoRegistro = false;
    } else {
      this.categoriaSelecionada = {
        id: null,
        nome: '',
        pontosPorHora: null,
        horasMinimas: null,
        horasMaximas: null,
      };
      this.novoRegistro = true;
    }
    this.exibirDialog = true;
  }

  fecharDialog(): void {
    this.exibirDialog = false;
    this.categoriaSelecionada = {
      id: null,
      nome: '',
      pontosPorHora: null,
      horasMinimas: null,
      horasMaximas: null,
    };
  }

  async salvarCategoria(): Promise<void> {
    try {
      // Validações obrigatórias
      if (!this.categoriaSelecionada.nome || this.categoriaSelecionada.nome.trim() === '') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'O nome é obrigatório.',
        });
        return;
      }
  
      if (this.categoriaSelecionada.pontosPorHora === null || this.categoriaSelecionada.pontosPorHora === undefined) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Os pontos por hora são obrigatórios.',
        });
        return;
      }
  
      // Valida se pontos por hora é maior que 0
      if (this.categoriaSelecionada.pontosPorHora <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Os pontos por hora devem ser maiores que 0.',
        });
        return;
      }
  
      // Validações para valores negativos
      if (
        this.categoriaSelecionada.horasMinimas !== null &&
        this.categoriaSelecionada.horasMinimas <= 0
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'O valor de horas mínimas devem ser maiores que 0.',
        });
        return;
      }
  
      if (
        this.categoriaSelecionada.horasMaximas !== null &&
        this.categoriaSelecionada.horasMaximas <= 0
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'O valor de horas máximas devem ser maiores que 0.',
        });
        return;
      }
  
      // Valida se horas mínimas não são maiores que horas máximas
      if (
        this.categoriaSelecionada.horasMinimas !== null &&
        this.categoriaSelecionada.horasMaximas !== null &&
        this.categoriaSelecionada.horasMinimas > this.categoriaSelecionada.horasMaximas
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'O valor de horas mínimas não pode ser maior que o de horas máximas.',
        });
        return;
      }
  
      // Ajusta os valores para null caso não sejam preenchidos
      this.categoriaSelecionada.horasMinimas =
        this.categoriaSelecionada.horasMinimas === '' ? null : this.categoriaSelecionada.horasMinimas;
      this.categoriaSelecionada.horasMaximas =
        this.categoriaSelecionada.horasMaximas === '' ? null : this.categoriaSelecionada.horasMaximas;
  
      let resposta;
      if (this.novoRegistro) {
        resposta = await this.categoriaService.criarCategoriaCertificado(
          this.categoriaSelecionada.nome,
          this.categoriaSelecionada.pontosPorHora,
          this.categoriaSelecionada.horasMinimas,
          this.categoriaSelecionada.horasMaximas
        );
      } else {
        resposta = await this.categoriaService.editarCategoriaCertificado(
          this.categoriaSelecionada.id,
          this.categoriaSelecionada.nome,
          this.categoriaSelecionada.pontosPorHora,
          this.categoriaSelecionada.horasMinimas,
          this.categoriaSelecionada.horasMaximas
        );
      }
  
      if (resposta?.error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: resposta?.data || 'Erro ao salvar a categoria.',
        });
        return;
      }
  
      this.carregarCategorias();
      this.fecharDialog();
    } catch (erro) {
      console.error('Erro ao salvar categoria:', erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro inesperado',
        detail: 'Tente novamente.',
      });
    }
  }
  
  

  async deletarCategoria(id: number): Promise<void> {
    try {
      const resposta = await this.categoriaService.deletarCategoriaCertificado(id);
      if (resposta?.error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar categoria.',
        });
        return;
      }
      this.carregarCategorias();
    } catch (erro) {
      console.error('Erro ao deletar categoria:', erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro inesperado',
        detail: 'Tente novamente.',
      });
    }
  }
}
