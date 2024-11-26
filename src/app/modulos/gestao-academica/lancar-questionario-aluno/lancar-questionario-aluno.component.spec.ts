import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancarQuestionarioAlunoComponent } from './lancar-questionario-aluno.component';

describe('LancarQuestionarioComponent', () => {
  let component: LancarQuestionarioAlunoComponent;
  let fixture: ComponentFixture<LancarQuestionarioAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancarQuestionarioAlunoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LancarQuestionarioAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

