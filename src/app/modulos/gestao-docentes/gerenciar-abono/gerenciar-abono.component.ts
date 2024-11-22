import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AbonoService } from '../services/abono.service';
import { TableModule } from 'primeng/table'; // Importando o módulo de tabelas
import { CheckboxModule } from 'primeng/checkbox'; // Importando o módulo CheckboxModule

@Component({
  selector: 'app-gerenciar-abono',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, TableModule, FormsModule,CheckboxModule],
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

  constructor(private abonoService: AbonoService) {}

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

  async salvarAbono(): Promise<void> {
    try {
      if (this.abonoSelecionado.semLimiteAno) {
        this.abonoSelecionado.maximoDiasAno = 0;
      }
      if (this.abonoSelecionado.semLimiteMes) {
        this.abonoSelecionado.maximoDiasMes = 0;
      }

      if (this.novoRegistro) {
        await this.abonoService.criarAbono(
          this.abonoSelecionado.nome,
          this.abonoSelecionado.abona,
          this.abonoSelecionado.maximoDiasAno,
          this.abonoSelecionado.maximoDiasMes
        );
      } else {
        await this.abonoService.editarAbono(
          this.abonoSelecionado.id,
          this.abonoSelecionado.nome,
          this.abonoSelecionado.abona,
          this.abonoSelecionado.maximoDiasAno,
          this.abonoSelecionado.maximoDiasMes
        );
      }
      this.carregarAbonos();
    } catch (erro) {
      console.error('Erro ao salvar abono:', erro);
    } finally {
      this.fecharDialog();
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
  }

  async criarCategoria(): Promise<void> {
    if (!this.categoriaForm.nome) {
      alert('O nome da categoria é obrigatório!');
      return;
    }

    try {
      const maximoDiasAno = this.categoriaForm.semLimiteAno ? 0 : this.categoriaForm.maximoDiasAno;
      const maximoDiasMes = this.categoriaForm.semLimiteMes ? 0 : this.categoriaForm.maximoDiasMes;

      await this.abonoService.criarAbono(
        this.categoriaForm.nome,
        true,
        maximoDiasAno,
        maximoDiasMes
      );
      this.fecharModalCategoria();
      this.carregarAbonos();
    } catch (erro) {
      console.error('Erro ao criar categoria:', erro);
    }
  }
}
