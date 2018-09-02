import { TestBed, inject } from '@angular/core/testing';

import { IntManLibService } from './int-man-lib.service';

describe('IntManLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntManLibService]
    });
  });

  it('should be created', inject([IntManLibService], (service: IntManLibService) => {
    expect(service).toBeTruthy();
  }));
});
