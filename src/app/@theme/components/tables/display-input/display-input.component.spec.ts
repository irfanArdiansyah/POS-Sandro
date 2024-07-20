import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayInputComponent } from './display-input.component';

describe('DisplayInputComponent', () => {
  let component: DisplayInputComponent;
  let fixture: ComponentFixture<DisplayInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
