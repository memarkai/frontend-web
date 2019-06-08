import { TestBed } from '@angular/core/testing';

import { ClinicApiService } from './clinic-api.service';

describe('ClinicApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClinicApiService = TestBed.get(ClinicApiService);
    expect(service).toBeTruthy();
  });
});
