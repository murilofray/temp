import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAlunosComponent } from './gerenciar-alunos.component';

describe('GerenciarAlunosComponent', () => {
  let component: GerenciarAlunosComponent;
  let fixture: ComponentFixture<GerenciarAlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAlunosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
