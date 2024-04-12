import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRecognitionComponent } from './object-recognition.component';

describe('ObjectRecognitionComponent', () => {
  let component: ObjectRecognitionComponent;
  let fixture: ComponentFixture<ObjectRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectRecognitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
