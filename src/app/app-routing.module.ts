import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Módulo comum
import { AuthGuard } from './guards/auth.guard';
import { ListaServidoresComponent } from './comum/lista-servidores/lista-servidores.component';
import { PerfilServidorComponent } from './comum/perfil-servidor/perfil-servidor.component';

// Módulo Gestão Acadêmica
import { GerenciarAlergiasComponent } from './modulos/gestao-academica/gerenciar-alergias/gerenciar-alergias.component';
import { GerenciarTiposAlergiasComponent } from './modulos/gestao-academica/gerenciar-tipos-alergias/gerenciar-tipos-alergias.component';
import { GerenciarAlunosComponent } from './modulos/gestao-academica/gerenciar-alunos/gerenciar-alunos.component';
import { GerenciarRelatoriosComponent } from './modulos/gestao-academica/gerenciar-relatorios/gerenciar-relatorios.component';
import { GerenciarTurmasComponent } from './modulos/gestao-academica/gerenciar-turmas/gerenciar-turmas.component';

// Módulo Gestão Docentes
import { GerenciarOcorrenciasComponent } from './modulos/gestao-docentes/gerenciar-ocorrencias/gerenciar-ocorrencias.component';
import { VisualizarOcorrenciasComponent } from './modulos/gestao-docentes/visualizar-ocorrencias/visualizar-ocorrencias.component';
import { LancarOcorrenciasComponent } from './modulos/gestao-docentes/lancar-ocorrencias/lancar-ocorrencias.component';
import { AcompanharPontuacaoComponent } from './modulos/gestao-docentes/acompanhar-pontuacao/acompanhar-pontuacao.component';
import { HomeComponent2 } from './modulos/gestao-docentes/home/home.component';
import { SubirTabelaComponent } from './modulos/gestao-docentes/subir-tabela/subir-tabela.component';

import { VisualizarPontuacaoParaAtribuicaoComponent } from './modulos/gestao-docentes/visualizar-pontuacao-para-atribuicao/visualizar-pontuacao-para-atribuicao.component';
import { RelatorioOcorrenciasParaProgressaoDiretorComponent } from './modulos/gestao-docentes/relatorio-ocorrencias-para-progressao-diretor/relatorio-ocorrencias-para-progressao-diretor.component';
import { GerenciarProgressoesDiretorComponent } from './modulos/gestao-docentes/gerenciar-progressoes-diretor/gerenciar-progressoes-diretor.component';
import { GerenciarTitulosComponent } from './modulos/gestao-docentes/gerenciar-titulos/gerenciar-titulos.component';
import { LancarTitulosComponent } from './modulos/gestao-docentes/lancar-titulos/lancar-titulos.component';
import { GerenciarAbonoComponent } from './modulos/gestao-docentes/gerenciar-abono/gerenciar-abono.component';


// Módulo Prestação de Conta
import { HomeComponent } from './modulos/prestacao-contas/home/home.component';
import { CadastrarServidorComponent } from './comum/cadastrar-servidor/cadastrar-servidor.component';
import { BemConsolidarProponenteComponent } from './modulos/prestacao-contas/consolidar-proponente/bem-consolidar-proponente/bem-consolidar-proponente.component';
import { ContaBancariaComponent } from './modulos/prestacao-contas/conta-bancaria-cadastro/conta-bancaria.component';
import { PddeCadastroComponent } from './modulos/prestacao-contas/pdde-cadastro/pdde-cadastro.component';
import { ProgramaCadastroComponent } from './modulos/prestacao-contas/programa/programa-cadastro.component';
import { BemPesquisaPrecoComponent } from './modulos/prestacao-contas/pesquisa-preco/bem-pesquisar-preco/bem-pesquisa-preco.component';
import { GerarTermoDeDoacaoComponent } from './modulos/prestacao-contas/gerar-termo-de-doacao/gerar-termo-de-doacao.component';
import { GerarDemonstrativoExecucaoComponent } from './modulos/prestacao-contas/gerar-demonstrativo-execucao/gerar-demonstrativo-execucao.component';
import { ListaApmsComponent } from './modulos/prestacao-contas/lista-apms/lista-apms.component';

// import { ServicoPesquisaPrecoComponent } from './modulos/prestacao-contas/pesquisa-preco/servico-pesquisar-preco/servico-pesquisa-preco.component';
import { ListaPesquisaPrecosComponent } from './modulos/prestacao-contas/pesquisa-preco/lista-pesquisa-precos/lista-pesquisa-precos.component';
import { ListarMovimentacaoComponent } from './modulos/prestacao-contas/movimentacao-financeira/listar-movimentacao/listar-movimentacao.component';
import { GerenciarAtaComponent } from './modulos/prestacao-contas/ata/gerenciar-ata.component';

// Sakai Template
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListaFornecedorComponent } from './modulos/prestacao-contas/fornecedor/lista-fornecedor/lista-fornecedor.component';
import { ListaOfiMemComponent } from './modulos/prestacao-contas/oficio-memorando/lista-ofimem/lista-ofimem.component';

//
// Cada grupo coloca a mão apenas onde é devido, evitando maiores conflitos nas linhas abaixo.
//
const routesAcademico: any = {
  path: 'academico',
  children: [
    { path: 'gerenciar-alergias', component: GerenciarAlergiasComponent },
    { path: 'gerenciar-tipos-alergias', component: GerenciarTiposAlergiasComponent },
    { path: 'gerenciar-alunos', component: GerenciarAlunosComponent },
    { path: 'gerenciar-relatorios', component: GerenciarRelatoriosComponent },
    { path: 'gerenciar-turmas', component: GerenciarTurmasComponent },
  ],
};

const routesDocentes: any = {
  path: 'docente',
  children: [
    { path: 'gerenciar-ocorrencia', component: GerenciarOcorrenciasComponent },
    { path: 'visualizar-ocorrencias', component: VisualizarOcorrenciasComponent },
    { path: 'lancar-ocorrencia', component: LancarOcorrenciasComponent },
    { path: 'acompanhar-pontuacao', component: AcompanharPontuacaoComponent },
    { path: 'home', component: HomeComponent2 },
    { path: 'subir-tabela', component: SubirTabelaComponent },
    { path: 'visualizar-pontuacao-para-atribuicao', component: VisualizarPontuacaoParaAtribuicaoComponent },
    { path: 'gerenciar-progressoes-diretor', component: GerenciarProgressoesDiretorComponent },
    { path: 'gerenciar-titulos', component: GerenciarTitulosComponent },
    { path: 'lancar-titulos', component: LancarTitulosComponent },
    {path: 'relatorio-ocorrencias-para-progressao-diretor', component: RelatorioOcorrenciasParaProgressaoDiretorComponent},
    {path: 'gerenciar-abono', component: GerenciarAbonoComponent}
  ],
};

const routesContas: any = {
  path: 'conta',
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'listarpesquisa', component: ListaPesquisaPrecosComponent },
    { path: 'pesquisa/B', component: BemPesquisaPrecoComponent },
    // { path: 'pesquisa/S', component:ServicoPesquisaPrecoComponent},
    { path: 'conta-bancaria-cadastro', component: ContaBancariaComponent },
    { path: 'pdde-cadastro', component: PddeCadastroComponent },
    { path: 'programa-cadastro', component: ProgramaCadastroComponent },
    { path: 'consolidar/B', component: BemConsolidarProponenteComponent },
    // { path: 'consolidar/S', component: BemConsolidarProponenteComponent },
    { path: 'movimentacoes', component: ListarMovimentacaoComponent },
    { path: 'atas', component: GerenciarAtaComponent },
    { path: 'gerar-termo-doacao', component: GerarTermoDeDoacaoComponent },
    { path: 'gerar-demonstrativo-execucao', component: GerarDemonstrativoExecucaoComponent },
    { path: 'fornecedores', component: ListaFornecedorComponent },
    { path: 'lista-apms', component: ListaApmsComponent },
    { path: 'oficio-memorando', component: ListaOfiMemComponent },
  ],
};

const routerComum: any = {
  path: 'comum',
  children: [
    { path: 'cadastrar-servidor', component: CadastrarServidorComponent },
    { path: 'lista-servidores', component: ListaServidoresComponent },
    { path: 'perfil-servidor', component: PerfilServidorComponent },
  ],
};

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: '',
              children: [
                {
                  path: '',
                  loadChildren: () =>
                    import('./demo/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
                },
                {
                  path: 'uikit',
                  loadChildren: () => import('./demo/components/uikit/uikit.module').then((m) => m.UIkitModule),
                },
                {
                  path: 'utilities',
                  loadChildren: () =>
                    import('./demo/components/utilities/utilities.module').then((m) => m.UtilitiesModule),
                },
                {
                  path: 'documentation',
                  loadChildren: () =>
                    import('./demo/components/documentation/documentation.module').then((m) => m.DocumentationModule),
                },
                {
                  path: 'blocks',
                  loadChildren: () =>
                    import('./demo/components/primeblocks/primeblocks.module').then((m) => m.PrimeBlocksModule),
                },
                {
                  path: 'pages',
                  loadChildren: () => import('./demo/components/pages/pages.module').then((m) => m.PagesModule),
                },

                // Solução que não gostei, mas não consegui fazer um redirecionamento de rota correta
                routesAcademico,
                routerComum,
                routesContas,
                routesDocentes,
              ],
            },
          ],
        },
        {
          path: 'login',
          loadChildren: () => import('./comum/login/login.module').then((m) => m.LoginModule),
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
