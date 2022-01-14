import { TestBed } from '@angular/core/testing';

import { RoomEditFormService } from './room-edit-form.service';

describe('RoomEditFormService', () => {
  let service: RoomEditFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomEditFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
