import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarTurmasComponent } from './gerenciar-turmas.component';

describe('GerenciarTurmasComponent', () => {
  let component: GerenciarTurmasComponent;
  let fixture: ComponentFixture<GerenciarTurmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarTurmasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarTurmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
