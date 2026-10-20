import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PhotoService } from './photo';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
