import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarUsuarioApmComponent } from './cadastrar-usuario-apm.component';

describe('CadastrarUsuarioApmComponent', () => {
  let component: CadastrarUsuarioApmComponent;
  let fixture: ComponentFixture<CadastrarUsuarioApmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarUsuarioApmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarUsuarioApmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
