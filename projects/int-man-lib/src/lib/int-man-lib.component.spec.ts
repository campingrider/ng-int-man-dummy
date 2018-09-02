import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntManLibComponent } from './int-man-lib.component';

describe('IntManLibComponent', () => {
  let component: IntManLibComponent;
  let fixture: ComponentFixture<IntManLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntManLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntManLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
