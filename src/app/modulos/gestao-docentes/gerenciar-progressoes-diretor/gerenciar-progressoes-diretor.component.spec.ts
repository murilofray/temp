import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarProgressoesDiretorComponent } from './gerenciar-progressoes-diretor.component';

describe('GerenciarProgressoesDiretorComponent', () => {
  let component: GerenciarProgressoesDiretorComponent;
  let fixture: ComponentFixture<GerenciarProgressoesDiretorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarProgressoesDiretorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarProgressoesDiretorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
