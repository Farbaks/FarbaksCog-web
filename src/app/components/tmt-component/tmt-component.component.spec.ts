import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmtComponentComponent } from './tmt-component.component';

describe('TmtComponentComponent', () => {
  let component: TmtComponentComponent;
  let fixture: ComponentFixture<TmtComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmtComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TmtComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
