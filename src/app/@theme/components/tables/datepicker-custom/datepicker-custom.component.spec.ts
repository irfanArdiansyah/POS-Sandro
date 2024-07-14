import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerCustomComponent } from './datepicker-custom.component';

describe('DatepickerCustomComponent', () => {
  let component: DatepickerCustomComponent;
  let fixture: ComponentFixture<DatepickerCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
