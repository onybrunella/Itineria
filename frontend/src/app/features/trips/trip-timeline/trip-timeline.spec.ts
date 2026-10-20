import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTimeline } from './trip-timeline';

describe('TripTimeline', () => {
  let component: TripTimeline;
  let fixture: ComponentFixture<TripTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(TripTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
