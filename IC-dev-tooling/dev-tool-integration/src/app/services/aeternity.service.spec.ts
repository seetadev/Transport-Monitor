import { TestBed } from '@angular/core/testing';

import { AeternityService } from './aeternity.service';

describe('AeternityService', () => {
  let service: AeternityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AeternityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
