import { TestBed } from '@angular/core/testing';

import { DanhmucService } from './danhmuc.service';

describe('DanhmucService', () => {
  let service: DanhmucService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DanhmucService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
