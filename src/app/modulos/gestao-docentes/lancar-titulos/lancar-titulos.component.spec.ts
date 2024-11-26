import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancarTitulosComponent } from './lancar-titulos.component';

describe('LancarTitulosComponent', () => {
  let component: LancarTitulosComponent;
  let fixture: ComponentFixture<LancarTitulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancarTitulosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LancarTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
