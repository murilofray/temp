import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancarEscolasComponent } from './lancar-escolas.component';

describe('LancarEscolasComponent', () => {
  let component: LancarEscolasComponent;
  let fixture: ComponentFixture<LancarEscolasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancarEscolasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LancarEscolasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

