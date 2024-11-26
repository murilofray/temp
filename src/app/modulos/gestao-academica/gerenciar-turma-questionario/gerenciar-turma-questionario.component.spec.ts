import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarTurmaQuestionarioComponent } from './gerenciar-turma-questionario.component';

describe('GerenciarTurmaQuestionarioComponent', () => {
  let component: GerenciarTurmaQuestionarioComponent;
  let fixture: ComponentFixture<GerenciarTurmaQuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarTurmaQuestionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarTurmaQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

