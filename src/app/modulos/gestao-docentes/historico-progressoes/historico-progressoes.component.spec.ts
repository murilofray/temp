import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoProgressoesComponent } from './historico-progressoes.component';

describe('GerenciarProgressoesDiretorComponent', () => {
  let component: HistoricoProgressoesComponent;
  let fixture: ComponentFixture<HistoricoProgressoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoProgressoesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoProgressoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
