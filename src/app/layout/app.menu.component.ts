import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NivelAcessoEnum } from '../enums/NivelAcessoEnum';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  filterMenuByAccess(menu: any[], userAccessLevels: string[]): any[] {
    return menu
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          if (!Array.isArray(item.requiredAccess)) {
            return true; // Permite itens sem restrição de acesso
          }
          return item.requiredAccess.some((access: string) => userAccessLevels.includes(access));
        }),
      }))
      .filter(section => section.items.length > 0); // Remove seções vazias
  }

  ngOnInit() {
    // Obtenção dos dados do Servidor logado
    // Obtenção dos níveis de acesso do Servidor logado
    const tokenJWT = localStorage.getItem('jwt');
    const decodedToken: JwtPayload = jwtDecode(tokenJWT);
    const nivelAcesso = decodedToken['servidor'].NivelAcessoServidor;

    const niveisAcesso = nivelAcesso.map(x => x.Acesso.descricao) // VAI LISTAR TODOS OS ACESSOS -> ['DIRETOR', 'DIRETOR_TEMPORARIO']

    // Se o ITEM não tiver um requiredAccess, ele irá aparecer no menu por padrão.
    // Itens do menu, dividido por módulos, para depois apresentar por nível de acesso
    const administrativo: any = {
      label: 'Administrativo',
      items: [{ label: 'Servidor', icon: 'pi pi-fw pi-user', routerLink: ['/comum/lista-servidores'], requiredAccess: [NivelAcessoEnum.ADMINISTRADOR.descricao] }], // UM EXEMPLO
    };

    const gestaoDocentes: any = {
      label: 'Gestão de Docentes',
      items: [
        { label: 'Tela Inicial', icon: 'pi pi-fw pi-home', routerLink: ['/docente/home'] },
        {
          label: 'Ocorrências',
          icon: 'pi pi-fw pi-exclamation-circle',
          items: [
            { label: 'Lançar Ocorrências', icon: 'pi pi-fw pi-pencil', routerLink: ['/docente/lancar-ocorrencia'] },
            { label: 'Visualizar Ocorrências', icon: 'pi pi-fw pi-eye', routerLink: ['/docente/visualizar-ocorrencias'] },
            { label: 'Relatório de Ocorrências', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/docente/relatorio-ocorrencias-para-progressao-diretor'] },
            { label: 'Gerenciar Ocorrências', icon: 'pi pi-fw pi-cog', routerLink: ['/docente/gerenciar-ocorrencia'] },
          ],
        },
        {
          label: 'Títulos',
          icon: 'pi pi-fw pi-bookmark',
          items: [
            { label: 'Lançar Títulos', icon: 'pi pi-fw pi-pencil', routerLink: ['/docente/lancar-titulos'] },
            { label: 'Gerenciar Títulos', icon: 'pi pi-fw pi-cog', routerLink: ['/docente/gerenciar-titulos'] },
          ],
        },
        {
          label: 'Pontuações e Progressões',
          icon: 'pi pi-fw pi-star',
          items: [
            { label: 'Pontuação para Atribuição de Aulas', icon: 'pi pi-fw pi-eye', routerLink: ['/docente/visualizar-pontuacao-para-atribuicao'] },
            { label: 'Gerenciar Progressões', icon: 'pi pi-fw pi-file', routerLink: ['/docente/gerenciar-progressoes-diretor'] },
            { label: 'Acompanhar Minha Pontuação', icon: 'pi pi-fw pi-chart-line', routerLink: ['/docente/acompanhar-pontuacao'] },
          ],
        },
        { label: 'Tabela de Vencimento', icon: 'pi pi-fw pi-calendar', routerLink: ['/docente/subir-tabela'] },
      ],
    };

    const gestaAcademica: any = {
      label: 'Gestão Acadêmica',
      items: [
        { label: 'Tela Inicial', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        { label: 'Gerenciar Alergias', icon: 'pi pi-fw pi-book', routerLink: ['/academico/gerenciar-alergias'] },
        {
          label: 'Categorias de Alergias',
          icon: 'pi pi-fw pi-book',
          routerLink: ['/academico/gerenciar-tipos-alergias'],
        },
        { label: 'Gerenciar Alunos', icon: 'pi pi-fw pi-user', routerLink: ['/academico/gerenciar-alunos'] },
        { label: 'Relatórios', icon: 'pi pi-fw pi-file-o', routerLink: ['/academico/gerenciar-relatorios'] },
        { label: 'Gerenciar Turmas', icon: 'pi pi-fw pi-users', routerLink: ['/academico/gerenciar-turmas'] },
      ],
    };

    const prestacaoContas: any = {
      label: 'Prestação de Contas',
      items: [
        { label: 'Tela Inicial', icon: 'pi pi-fw pi-home', routerLink: ['/conta/home'] },
        { label: 'Conta Bancária', icon: 'pi pi-fw pi-pencil', routerLink: ['/conta/conta-bancaria-cadastro'] },
        { label: 'PDDE', icon: 'pi pi-fw pi-eye', routerLink: ['/conta/pdde-cadastro'] },
        { label: 'Programa', icon: 'pi pi-fw pi-bars', routerLink: ['/conta/programa-cadastro'] },
        { label: 'Ata', icon: 'pi pi-fw pi-file', routerLink: ['/conta/atas'] },
        { label: 'Fornecedores', icon: 'pi pi-fw pi-building', routerLink: ['/conta/fornecedores'] },
        { label: "APM's", icon: 'pi pi-fw pi-user', routerLink: ['/conta/lista-apms'] },
      ],
    };

    const rawModel = [administrativo, gestaoDocentes, gestaAcademica, prestacaoContas];
    this.model = this.filterMenuByAccess(rawModel, niveisAcesso);
  }
}
