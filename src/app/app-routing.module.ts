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
import { GerenciarEscolasComponent } from './modulos/gestao-academica/gerenciar-escolas/gerenciar-escolas.component';
import { LancarEscolasComponent } from './modulos/gestao-academica/lancar-escolas/lancar-escolas.component';
import { GerenciarQuestionarioComponent } from './modulos/gestao-academica/gerenciar-questionario/gerenciar-questionario.component';
import { LancarQuestionarioComponent } from './modulos/gestao-academica/lancar-questionario/lancar-questionario.component';
import { LancarQuestionarioAlunoComponent } from './modulos/gestao-academica/lancar-questionario-aluno/lancar-questionario-aluno.component';
import { GerenciarQuestionarioAlunoComponent } from './modulos/gestao-academica/gerenciar-questionario-aluno/gerenciar-questionario-aluno.component';
import { GerenciarTurmaQuestionarioComponent } from './modulos/gestao-academica/gerenciar-turma-questionario/gerenciar-turma-questionario.component';
import { RealizarMatriculaComponent } from './modulos/gestao-academica/realizar-matricula/realizar-matricula.component';

// Módulo Gestão Docentes
import { GerenciarOcorrenciasComponent } from './modulos/gestao-docentes/gerenciar-ocorrencias/gerenciar-ocorrencias.component';
import { VisualizarOcorrenciasComponent } from './modulos/gestao-docentes/visualizar-ocorrencias/visualizar-ocorrencias.component';
import { LancarOcorrenciasComponent } from './modulos/gestao-docentes/lancar-ocorrencias/lancar-ocorrencias.component';
import { AcompanharPontuacaoComponent } from './modulos/gestao-docentes/acompanhar-pontuacao/acompanhar-pontuacao.component';
import { HomeComponent2 } from './modulos/gestao-docentes/home/home.component';
import { HomeSecretariaComponent } from './modulos/gestao-docentes/home-secretaria/home-secretaria.component';
import { SubirTabelaComponent } from './modulos/gestao-docentes/subir-tabela/subir-tabela.component';
import { AcompanharProgressoesComponent } from './modulos/gestao-docentes/acompanhar-progressoes/acompanhar-progressoes.component';
import { HistoricoProgressoesComponent } from './modulos/gestao-docentes/historico-progressoes/historico-progressoes.component';
import { VisualizarPontuacaoParaAtribuicaoComponent } from './modulos/gestao-docentes/visualizar-pontuacao-para-atribuicao/visualizar-pontuacao-para-atribuicao.component';
import { RelatorioOcorrenciasParaProgressaoDiretorComponent } from './modulos/gestao-docentes/relatorio-ocorrencias-para-progressao-diretor/relatorio-ocorrencias-para-progressao-diretor.component';
import { GerenciarProgressoesDiretorComponent } from './modulos/gestao-docentes/gerenciar-progressoes-diretor/gerenciar-progressoes-diretor.component';
import { GerenciarTitulosComponent } from './modulos/gestao-docentes/gerenciar-titulos/gerenciar-titulos.component';
import { LancarTitulosComponent } from './modulos/gestao-docentes/lancar-titulos/lancar-titulos.component';
import { GerenciarAbonoComponent } from './modulos/gestao-docentes/gerenciar-abono/gerenciar-abono.component';
import { GerenciarCategoriaCertificadoComponent } from './modulos/gestao-docentes/gerenciar-categoria-certificado/gerenciar-categoria-certificado.component';


// Módulo Prestação de Conta
import { HomeComponent } from './modulos/prestacao-contas/home/home.component';
import { CadastrarServidorComponent } from './comum/cadastrar-servidor/cadastrar-servidor.component';
import { BemConsolidarProponenteComponent } from './modulos/prestacao-contas/pesquisa-preco/bem-consolidar-proponente/bem-consolidar-proponente.component';
import { ContaBancariaComponent } from './modulos/prestacao-contas/conta-bancaria-cadastro/conta-bancaria.component';
import { PddeCadastroComponent } from './modulos/prestacao-contas/pdde-cadastro/pdde-cadastro.component';
import { ProgramaCadastroComponent } from './modulos/prestacao-contas/programa/programa-cadastro.component';
import { BemPesquisaPrecoComponent } from './modulos/prestacao-contas/pesquisa-preco/bem-pesquisar-preco/bem-pesquisa-preco.component';
import { ServicoPesquisaPrecoComponent } from './modulos/prestacao-contas/pesquisa-preco/servico-pesquisa-preco/servico-pesquisa-preco.component';
import { ServicoConsolidarProponenteComponent } from './modulos/prestacao-contas/pesquisa-preco/servico-consolidar-proponente/servico-consolidar-proponente.component';
import { GerarTermoDeDoacaoComponent } from './modulos/prestacao-contas/gerar-termo-de-doacao/gerar-termo-de-doacao.component';
import { GerarDemonstrativoExecucaoComponent } from './modulos/prestacao-contas/gerar-demonstrativo-execucao/gerar-demonstrativo-execucao.component';
import { ListaApmsComponent } from './modulos/prestacao-contas/lista-apms/lista-apms.component';
import { CadastrarApmComponent } from './modulos/prestacao-contas/cadastrar-apm/cadastrar-apm.component';
import { CadastrarUsuarioApmComponent } from './modulos/prestacao-contas/cadastrar-usuario-apm/cadastrar-usuario-apm.component';

import { ListaPesquisaPrecosComponent } from './modulos/prestacao-contas/pesquisa-preco/lista-pesquisa-precos/lista-pesquisa-precos.component';
import { ListarMovimentacaoComponent } from './modulos/prestacao-contas/movimentacao-financeira/listar-movimentacao/listar-movimentacao.component';
import { GerenciarAtaComponent } from './modulos/prestacao-contas/ata/gerenciar-ata.component';

// Sakai Template
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListaFornecedorComponent } from './modulos/prestacao-contas/fornecedor/lista-fornecedor/lista-fornecedor.component';
import { ListaOfiMemComponent } from './modulos/prestacao-contas/oficio-memorando/lista-ofimem/lista-ofimem.component';
import { VisualizarQuinquenioComponent } from './modulos/gestao-docentes/visualizar-quinquenio/visualizar-quinquenio.component';
import { RealizarTransferenciaComponent } from './modulos/gestao-academica/realizar-transferencia/realizar-transferencia.component';
import { GerenciarConfiguracoesSistemaComponent } from './modulos/gestao-docentes/gerenciar-configuracoes-sistema/gerenciar-configuracoes-sistema.component';

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
    { path: 'questionarios', component: GerenciarQuestionarioComponent },
    { path: 'questionarios/inserir', component: LancarQuestionarioComponent },
    { path: 'questionarios/editar', component: LancarQuestionarioComponent },
    { path: 'questionarios/resposta', component: LancarQuestionarioAlunoComponent },
    { path: 'questionarios/aluno', component: GerenciarQuestionarioAlunoComponent },
    { path: 'questionarios/turma', component: GerenciarTurmaQuestionarioComponent },
    { path: 'realizar-matricula', component: RealizarMatriculaComponent },
    { path: 'realizar-transferencia', component: RealizarTransferenciaComponent },
  ],
};

const routesDocentes: any = {
  path: 'docente',
  children: [
    { path: 'gerenciar-ocorrencia', component: GerenciarOcorrenciasComponent },
    { path: 'visualizar-ocorrencias', component: VisualizarOcorrenciasComponent },
    { path: 'lancar-ocorrencia', component: LancarOcorrenciasComponent },
    { path: 'acompanhar-pontuacao', component: AcompanharPontuacaoComponent },
    { path: 'acompanhar-progressoes', component: AcompanharProgressoesComponent },
    { path: 'historico-progressoes', component: HistoricoProgressoesComponent },
    { path: 'home', component: HomeComponent2 },
    { path: 'home-secretaria', component: HomeSecretariaComponent },
    { path: 'subir-tabela', component: SubirTabelaComponent },
    { path: 'visualizar-pontuacao-para-atribuicao', component: VisualizarPontuacaoParaAtribuicaoComponent },
    { path: 'gerenciar-progressoes-diretor', component: GerenciarProgressoesDiretorComponent },
    { path: 'gerenciar-titulos', component: GerenciarTitulosComponent },
    { path: 'lancar-titulos', component: LancarTitulosComponent },
    {
      path: 'relatorio-ocorrencias-para-progressao-diretor',
      component: RelatorioOcorrenciasParaProgressaoDiretorComponent,
    },
    {  path: 'gerenciar-abono', component: GerenciarAbonoComponent },
    { path: 'gerenciar-categoria-certificado', component: GerenciarCategoriaCertificadoComponent},
    { path: 'visualizar-quinquenio', component: VisualizarQuinquenioComponent },
    { path: 'gerenciar-configuracoes-sistema', component: GerenciarConfiguracoesSistemaComponent},
  ],
};

const routesContas: any = {
  path: 'conta',
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'listarpesquisa', component: ListaPesquisaPrecosComponent },
    { path: 'pesquisa/B', component: BemPesquisaPrecoComponent },
    { path: 'pesquisa/S', component: ServicoPesquisaPrecoComponent },
    { path: 'conta-bancaria-cadastro', component: ContaBancariaComponent },
    { path: 'pdde-cadastro', component: PddeCadastroComponent },
    { path: 'programa-cadastro', component: ProgramaCadastroComponent },
    { path: 'consolidar/B', component: BemConsolidarProponenteComponent },
    { path: 'consolidar/S', component: ServicoConsolidarProponenteComponent },
    { path: 'movimentacoes', component: ListarMovimentacaoComponent },
    { path: 'atas', component: GerenciarAtaComponent },
    { path: 'gerar-termo-doacao', component: GerarTermoDeDoacaoComponent },
    { path: 'gerar-demonstrativo-execucao', component: GerarDemonstrativoExecucaoComponent },
    { path: 'fornecedores', component: ListaFornecedorComponent },
    { path: 'lista-apms', component: ListaApmsComponent },
    { path: 'oficio-memorando', component: ListaOfiMemComponent },
    { path: 'cadastrar-apm', component: CadastrarApmComponent },
    { path: 'cadastrar-usuario-apm', component: CadastrarUsuarioApmComponent },
  ],
};

const routerComum: any = {
  path: 'comum',
  children: [
    { path: 'cadastrar-servidor', component: CadastrarServidorComponent },
    { path: 'lista-servidores', component: ListaServidoresComponent },
    { path: 'perfil-servidor', component: PerfilServidorComponent },
    { path: 'escolas', component: GerenciarEscolasComponent },
    { path: 'escolas/inserir', component: LancarEscolasComponent },
    { path: 'escolas/editar', component: LancarEscolasComponent },
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

