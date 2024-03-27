import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmtAssessmentComponent } from './tmt-assessment.component';

describe('TmtAssessmentComponent', () => {
  let component: TmtAssessmentComponent;
  let fixture: ComponentFixture<TmtAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmtAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TmtAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
