import { TestBed } from '@angular/core/testing';

import { ClientUserGaurdService } from './client-user-gaurd.service';

describe('ClientUserGaurdService', () => {
  let service: ClientUserGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientUserGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
