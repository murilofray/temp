import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarTitulosComponent } from './gerenciar-titulos.component';

describe('GerenciarTitulosComponent', () => {
  let component: GerenciarTitulosComponent;
  let fixture: ComponentFixture<GerenciarTitulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarTitulosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
