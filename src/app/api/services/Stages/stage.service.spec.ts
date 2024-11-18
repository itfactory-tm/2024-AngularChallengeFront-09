import { TestBed } from '@angular/core/testing';

import { StageService } from './stage.service';

describe('StagesService', () => {
  let service: StageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
