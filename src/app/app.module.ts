import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData as angularRegisterLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HashLocationStrategy } from '@angular/common'; 

// Sakai Template
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

// Módulos Secretária
// // Prestação de Contas
import { HomeModule } from './modulos/prestacao-contas/home/home.module';
import { ContaBancariaModule } from './modulos/prestacao-contas/conta-bancaria-cadastro/conta-bancaria.module';
import { PddeCadastroModule } from './modulos/prestacao-contas/pdde-cadastro/pdde-cadastro.module';
import { ProgramaCadastroModule } from './modulos/prestacao-contas/programa/programa-cadastro.module';
import { ItemPesquisaPrecoModule } from './modulos/prestacao-contas/pesquisa-preco/item-pesquisar-preco/item-pesquisa-preco.modules';
import { ListaPesquisaPrecosModule } from './modulos/prestacao-contas/pesquisa-preco/lista-pesquisa-precos/lista-pesquisa-precos.modules';
import { GerenciarAtaModule } from './modulos/prestacao-contas/ata/gerenciar-ata.module';
import { ListaFornecedorModule } from './modulos/prestacao-contas/fornecedor/lista-fornecedor/lista-fornecedor.modules';
import { ListarMovimentacaoModule } from './modulos/prestacao-contas/movimentacao-financeira/listar-movimentacao/listar-movimentacao.modules';

// // Gestão de Docentes

// // Gestão Acadêmica

// Módulos Comum
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';

angularRegisterLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    ContaBancariaModule,
    PddeCadastroModule,
    ProgramaCadastroModule,
    HttpClientModule,
    AppLayoutModule,
    ItemPesquisaPrecoModule,
    ListaPesquisaPrecosModule,
    ListarMovimentacaoModule,
    ListaFornecedorModule,
    GerenciarAtaModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy  },
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}

function registerLocaleData(localePt: any, arg1: string) {
  throw new Error('Function not implemented.');
}

