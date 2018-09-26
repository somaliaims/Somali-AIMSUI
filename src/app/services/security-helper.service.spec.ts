import { TestBed } from '@angular/core/testing';

import { SecurityHelperService } from './security-helper.service';

describe('SecurityHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityHelperService = TestBed.get(SecurityHelperService);
    expect(service).toBeTruthy();
  });
});
