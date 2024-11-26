import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPontuacaoParaAtribuicaoComponent } from './visualizar-pontuacao-para-atribuicao.component';

describe('VisualizarPontuacaoParaAtribuicaoComponent', () => {
  let component: VisualizarPontuacaoParaAtribuicaoComponent;
  let fixture: ComponentFixture<VisualizarPontuacaoParaAtribuicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarPontuacaoParaAtribuicaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarPontuacaoParaAtribuicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
