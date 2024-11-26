import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarConfiguracoesSistemaComponent } from './gerenciar-configuracoes-sistema.component';

describe('GerenciarConfiguracoesSistemaComponent', () => {
  let component: GerenciarConfiguracoesSistemaComponent;
  let fixture: ComponentFixture<GerenciarConfiguracoesSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarConfiguracoesSistemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarConfiguracoesSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
