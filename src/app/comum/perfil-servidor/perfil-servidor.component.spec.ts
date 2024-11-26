import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilServidorComponent } from './perfil-servidor.component';

describe('PerfilServidorComponent', () => {
  let component: PerfilServidorComponent;
  let fixture: ComponentFixture<PerfilServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilServidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
