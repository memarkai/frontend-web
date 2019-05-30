import { TestBed } from '@angular/core/testing';

import { AppointmentEntryService } from './appointment-entry.service';

describe('AppointmentEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentEntryService = TestBed.get(AppointmentEntryService);
    expect(service).toBeTruthy();
  });
});
