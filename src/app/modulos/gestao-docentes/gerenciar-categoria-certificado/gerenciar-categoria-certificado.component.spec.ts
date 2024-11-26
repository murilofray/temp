import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarCategoriaCertificadoComponent } from './gerenciar-categoria-certificado.component';

describe('GerenciarAbonoComponent', () => {
  let component: GerenciarCategoriaCertificadoComponent;
  let fixture: ComponentFixture<GerenciarCategoriaCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarCategoriaCertificadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarCategoriaCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
