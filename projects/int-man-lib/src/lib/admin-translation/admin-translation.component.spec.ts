import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTranslationComponent } from './admin-translation.component';

describe('AdminTranslationComponent', () => {
  let component: AdminTranslationComponent;
  let fixture: ComponentFixture<AdminTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
