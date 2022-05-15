import { TestBed } from '@angular/core/testing';

import { DonhangService } from './donhang.service';

describe('DonhangService', () => {
  let service: DonhangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonhangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
