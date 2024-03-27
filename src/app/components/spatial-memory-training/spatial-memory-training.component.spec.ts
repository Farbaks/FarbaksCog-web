import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpatialMemoryTrainingComponent } from './spatial-memory-training.component';

describe('SpatialMemoryTrainingComponent', () => {
  let component: SpatialMemoryTrainingComponent;
  let fixture: ComponentFixture<SpatialMemoryTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpatialMemoryTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpatialMemoryTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
