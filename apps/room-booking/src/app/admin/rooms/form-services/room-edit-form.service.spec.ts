import { TestBed } from '@angular/core/testing';

import { RoomFormService } from './room-form.service';

describe('RoomEditFormService', () => {
  let service: RoomFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
