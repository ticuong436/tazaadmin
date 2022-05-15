import { TestBed } from '@angular/core/testing';

import { DonhangDetailService } from './donhang-detail.service';

describe('DonhangDetailService', () => {
  let service: DonhangDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonhangDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
