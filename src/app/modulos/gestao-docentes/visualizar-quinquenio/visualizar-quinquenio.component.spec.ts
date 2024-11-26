import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarQuinquenioComponent } from './visualizar-quinquenio.component';

describe('VisualizarQuinquenioComponent', () => {
  let component: VisualizarQuinquenioComponent;
  let fixture: ComponentFixture<VisualizarQuinquenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarQuinquenioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarQuinquenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
