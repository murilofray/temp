import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarRelatoriosComponent } from './gerenciar-relatorios.component';

describe('GerenciarRelatoriosComponent', () => {
  let component: GerenciarRelatoriosComponent;
  let fixture: ComponentFixture<GerenciarRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarRelatoriosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
