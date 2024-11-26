import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarEscolasComponent } from './gerenciar-escolas.component';

describe('GerenciarEscolasComponent', () => {
  let component: GerenciarEscolasComponent;
  let fixture: ComponentFixture<GerenciarEscolasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarEscolasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarEscolasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

