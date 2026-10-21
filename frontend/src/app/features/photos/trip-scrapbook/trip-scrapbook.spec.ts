import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripScrapbook } from './trip-scrapbook';

describe('TripScrapbook', () => {
  let component: TripScrapbook;
  let fixture: ComponentFixture<TripScrapbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripScrapbook],
    }).compileComponents();

    fixture = TestBed.createComponent(TripScrapbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
