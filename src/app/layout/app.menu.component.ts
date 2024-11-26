import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NivelAcessoEnum as nae } from '../enums/NivelAcessoEnum';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  filterMenuByAccess(menu: any[], userAccessLevels: string[]): any[] {
    return menu
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!Array.isArray(item.requiredAccess)) {
            return true; // Permite itens sem restrição de acesso
          }
          return item.requiredAccess.some((access: string) => userAccessLevels.includes(access));
        }),
      }))
      .filter((section) => section.items.length > 0); // Remove seções vazias
  }

  ngOnInit() {
    // Obtenção dos dados do Servidor logado
    // Obtenção dos níveis de acesso do Servidor logado
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
    const nivelAcesso = decodedToken['servidor'].NivelAcessoServidor;

    const niveisAcesso = nivelAcesso.map((x) => x.Acesso.descricao); // VAI LISTAR TODOS OS ACESSOS -> ['DIRETOR', 'DIRETOR_TEMPORARIO']

    // Se o ITEM não tiver um requiredAccess, ele irá aparecer no menu por padrão.
    // Itens do menu, dividido por módulos, para depois apresentar por nível de acesso
    const administrativo: any = {
      label: 'Administrativo',
      items: [
        {
          label: 'Servidor',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/comum/lista-servidores'],
          requiredAccess: [nae.ADMINISTRADOR.descricao],
        },
        {
          label: 'Gerenciar Abono',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/docente/gerenciar-abono'],
          requiredAccess: [nae.ADMINISTRADOR.descricao],
        },
        {
          label: 'Gerenciar Categoria Certificado',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/docente/gerenciar-categoria-certificado'],
          requiredAccess: [nae.ADMINISTRADOR.descricao],
        },
        {
          label: 'Escolas',
          icon: 'pi pi-fw pi-building',
          routerLink: ['/comum/escolas'],
          requiredAccess: [nae.ADMINISTRADOR.descricao],
        },
      ], // UM EXEMPLO
    };

    const gestaoDocentes: any = {
      label: 'Gestão de Docentes',
      items: [
        { label: 'Tela Inicial', icon: 'pi pi-fw pi-home', routerLink: ['/docente/home'], requiredAccess: [nae.DOCENTE.descricao], },
        { label: 'Tela Inicial - Secretaria', icon: 'pi pi-fw pi-home', routerLink: ['/docente/home-secretaria'],  requiredAccess: [nae.ADMINISTRADOR.descricao],  },
        
        {
          label: 'Ocorrências',
          icon: 'pi pi-fw pi-exclamation-circle',
          items: [
            { label: 'Lançar Ocorrências', icon: 'pi pi-fw pi-pencil', routerLink: ['/docente/lancar-ocorrencia'],
              requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao, nae.ESCRITUARIO.descricao],
             },
            {
              label: 'Visualizar Ocorrências',
              icon: 'pi pi-fw pi-eye',
              routerLink: ['/docente/visualizar-ocorrencias'],
              requiredAccess: [
                nae.DIRETOR.descricao,
                nae.VICE_DIRETOR.descricao,
                nae.DOCENTE.descricao,
                nae.ESCRITUARIO.descricao,
              ],
            },
            {
              label: 'Relatório de Ocorrências',
              icon: 'pi pi-fw pi-chart-bar',
              routerLink: ['/docente/relatorio-ocorrencias-para-progressao-diretor'],
              requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao],
            },
            { label: 'Gerenciar Ocorrências', icon: 'pi pi-fw pi-cog', routerLink: ['/docente/gerenciar-ocorrencia'] },
          ],
        },
        {
          label: 'Títulos',
          icon: 'pi pi-fw pi-bookmark',
          items: [
            { label: 'Lançar Títulos', icon: 'pi pi-fw pi-pencil', routerLink: ['/docente/lancar-titulos'],
              requiredAccess: [
                nae.DIRETOR.descricao,
                nae.VICE_DIRETOR.descricao,
                nae.DOCENTE.descricao,
                nae.ESCRITUARIO.descricao,
              ],
             },
            { label: 'Gerenciar Títulos', icon: 'pi pi-fw pi-cog', routerLink: ['/docente/gerenciar-titulos'],
              requiredAccess: [
                nae.DIRETOR.descricao,
                nae.VICE_DIRETOR.descricao,
                nae.ADMINISTRADOR.descricao,
              ],
             },
          ],
        },
        {
          label: 'Pontuações e Progressões',
          icon: 'pi pi-fw pi-star',
          items: [
            {
              label: 'Pontuação para Atribuição de Aulas',
              icon: 'pi pi-fw pi-eye',
              routerLink: ['/docente/visualizar-pontuacao-para-atribuicao'],
              requiredAccess: [
                nae.DIRETOR.descricao,
                nae.VICE_DIRETOR.descricao,
                nae.DOCENTE.descricao,
                nae.ESCRITUARIO.descricao,
              ],
            },
            {
              label: 'Progressões em Andamento',
              icon: 'pi pi-fw pi-eye',
              routerLink: ['/docente/acompanhar-progressoes'],
              requiredAccess: [nae.ADMINISTRADOR.descricao],
            },
            {
              label: 'Gerenciar Progressões',
              icon: 'pi pi-fw pi-file',
              routerLink: ['/docente/gerenciar-progressoes-diretor'],
              requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao],
            },
            {
              label: 'Histórico de Progressões',
              icon: 'pi pi-fw pi-chart-bar',
              routerLink: ['/docente/historico-progressoes'],
              requiredAccess: [nae.ADMINISTRADOR.descricao],
            },
            {
              label: 'Acompanhar Minha Pontuação',
              icon: 'pi pi-fw pi-chart-line',
              routerLink: ['/docente/acompanhar-pontuacao'],
              requiredAccess: [
                nae.DIRETOR.descricao,
                nae.VICE_DIRETOR.descricao,
                nae.DOCENTE.descricao,
                nae.ESCRITUARIO.descricao,
              ],
            },
          ],
        },
        { label: 'Tabela de Vencimento', icon: 'pi pi-fw pi-calendar', routerLink: ['/docente/subir-tabela'] },
        {
          label: 'Configurações do Sistema',
          icon: 'pi pi-sliders-h',
          routerLink: ['/docente/gerenciar-configuracoes-sistema'],
          requiredAccess: [nae.ADMINISTRADOR.descricao],
        },
        { label: 'Visualizar Quinquênio', icon: 'pi pi-calculator', routerLink: ['/docente/visualizar-quinquenio'],
          requiredAccess: [
            nae.DIRETOR.descricao,
            nae.VICE_DIRETOR.descricao,
            nae.DOCENTE.descricao,
            nae.ESCRITUARIO.descricao,
          ],
         },
      ],
    };

    const gestaAcademica: any = {
      label: 'Gestão Acadêmica',
      items: [
        { label: 'Tela Inicial', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        {
          label: 'Turma',
          icon: 'pi pi-fw pi-id-card',
          routerLink: ['/academico/questionarios/turma'],
          requiredAccess: [nae.DOCENTE.descricao],
        },
        {
          label: 'Questionários',
          icon: 'pi pi-fw pi-pencil',
          routerLink: ['/academico/questionarios'],
          requiredAccess: [nae.COORDENADOR.descricao],
        },
        {

          label: 'Gerenciar Alergias',

          icon: 'pi pi-fw pi-book',

          routerLink: ['/academico/gerenciar-alergias'],

          requiredAccess: [nae.COORDENADOR.descricao, nae.ADMINISTRADOR.descricao],
        },
        {
          label: 'Categorias de Alergias',
          icon: 'pi pi-fw pi-book',
          routerLink: ['/academico/gerenciar-tipos-alergias'],
          requiredAccess: [nae.COORDENADOR.descricao, nae.ADMINISTRADOR.descricao],
        },
        { label: 'Gerenciar Alunos', icon: 'pi pi-fw pi-user', routerLink: ['/academico/gerenciar-alunos'] },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file-o', routerLink: ['/academico/gerenciar-relatorios'] },
        {
          label: 'Gerenciar Turmas',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/academico/gerenciar-turmas'],
          requiredAccess: [nae.COORDENADOR.descricao, nae.DIRETOR.descricao, nae.ADMINISTRADOR.descricao],
        },
        {
          label: 'Realizar Matrícula',
          icon: 'pi pi-id-card',
          routerLink: ['/academico/realizar-matricula'],
          requiredAccess: [nae.ESCRITUARIO.descricao, nae.DIRETOR.descricao],
        },
        {
          label: 'Realizar Transferência',
          icon: 'pi pi-id-card',
          routerLink: ['/academico/realizar-transferencia'],
          requiredAccess: [nae.ESCRITUARIO.descricao, nae.DIRETOR.descricao],
        },
      ],
    };

    const prestacaoContas: any = {
      label: 'Prestação de Contas',
      items: [
        {
          label: 'PDDEs',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/conta/home'],
          requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao, nae.APM.descricao],
        },
        {
          label: 'Ata',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/conta/atas'],
          requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao, nae.APM.descricao],
        },
        {
          label: 'Fornecedores',
          icon: 'pi pi-fw pi-building',
          routerLink: ['/conta/fornecedores'],
          requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao, nae.APM.descricao],
        },
        {
          label: 'APM',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/conta/lista-apms'],
          requiredAccess: [nae.DIRETOR.descricao, nae.VICE_DIRETOR.descricao, nae.APM.descricao],
        },
      ],
    };

    const rawModel = [administrativo, gestaoDocentes, gestaAcademica, prestacaoContas];
    this.model = this.filterMenuByAccess(rawModel, niveisAcesso);
  }
}

