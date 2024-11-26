import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarApmComponent } from './cadastrar-apm.component';

describe('CadastrarApmComponent', () => {
  let component: CadastrarApmComponent;
  let fixture: ComponentFixture<CadastrarApmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarApmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarApmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
