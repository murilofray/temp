import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarMatriculaComponent } from './realizar-matricula.component';

describe('RealizarMatriculaComponent', () => {
  let component: RealizarMatriculaComponent;
  let fixture: ComponentFixture<RealizarMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarMatriculaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealizarMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
