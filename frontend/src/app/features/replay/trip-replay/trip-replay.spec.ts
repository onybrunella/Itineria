import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { TripReplay } from './trip-replay';

describe('TripReplay', () => {
  let component: TripReplay;
  let fixture: ComponentFixture<TripReplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripReplay],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripReplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
