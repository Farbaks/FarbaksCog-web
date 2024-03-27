import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsRecallTrainingComponent } from './words-recall-training.component';

describe('WordsRecallTrainingComponent', () => {
  let component: WordsRecallTrainingComponent;
  let fixture: ComponentFixture<WordsRecallTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsRecallTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordsRecallTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
