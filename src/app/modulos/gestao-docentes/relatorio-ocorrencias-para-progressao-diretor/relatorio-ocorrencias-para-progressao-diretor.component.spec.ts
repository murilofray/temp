import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioOcorrenciasParaProgressaoDiretorComponent } from './relatorio-ocorrencias-para-progressao-diretor.component';

describe('RelatorioOcorrenciasParaProgressaoDiretorComponent', () => {
  let component: RelatorioOcorrenciasParaProgressaoDiretorComponent;
  let fixture: ComponentFixture<RelatorioOcorrenciasParaProgressaoDiretorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioOcorrenciasParaProgressaoDiretorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioOcorrenciasParaProgressaoDiretorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
