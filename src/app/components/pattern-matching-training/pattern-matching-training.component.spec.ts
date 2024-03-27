import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternMatchingTrainingComponent } from './pattern-matching-training.component';

describe('PatternMatchingTrainingComponent', () => {
  let component: PatternMatchingTrainingComponent;
  let fixture: ComponentFixture<PatternMatchingTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternMatchingTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatternMatchingTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
