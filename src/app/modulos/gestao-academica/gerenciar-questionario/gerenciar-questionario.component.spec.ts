import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarQuestionarioComponent } from './gerenciar-questionario.component';

describe('GerenciarQuestionarioComponent', () => {
  let component: GerenciarQuestionarioComponent;
  let fixture: ComponentFixture<GerenciarQuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarQuestionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

