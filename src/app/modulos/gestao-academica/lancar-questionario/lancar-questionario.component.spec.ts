import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancarQuestionarioComponent } from './lancar-questionario.component';

describe('LancarQuestionarioComponent', () => {
  let component: LancarQuestionarioComponent;
  let fixture: ComponentFixture<LancarQuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancarQuestionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LancarQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

