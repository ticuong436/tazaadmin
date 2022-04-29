import { TestBed } from '@angular/core/testing';

import { SanphamService } from './sanpham.service';

describe('SanphamService', () => {
  let service: SanphamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanphamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
