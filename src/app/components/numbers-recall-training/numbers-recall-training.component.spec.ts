import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumbersRecallTrainingComponent } from './numbers-recall-training.component';

describe('NumbersRecallTrainingComponent', () => {
  let component: NumbersRecallTrainingComponent;
  let fixture: ComponentFixture<NumbersRecallTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumbersRecallTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumbersRecallTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
