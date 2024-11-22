import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAbonoComponent } from './gerenciar-abono.component';

describe('GerenciarAbonoComponent', () => {
  let component: GerenciarAbonoComponent;
  let fixture: ComponentFixture<GerenciarAbonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAbonoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarAbonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
