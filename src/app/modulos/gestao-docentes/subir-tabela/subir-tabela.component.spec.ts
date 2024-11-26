import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirTabelaComponent } from './subir-tabela.component';

describe('SubirTabelaComponent', () => {
  let component: SubirTabelaComponent;
  let fixture: ComponentFixture<SubirTabelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirTabelaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubirTabelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
