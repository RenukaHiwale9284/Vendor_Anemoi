import { TestBed } from '@angular/core/testing';

import { BusinessUserGaurdService } from './business-user-gaurd.service';

describe('BusinessUserGaurdService', () => {
  let service: BusinessUserGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessUserGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
