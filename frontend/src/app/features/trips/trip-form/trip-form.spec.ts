import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TripForm } from './trip-form';

describe('TripForm', () => {
  let component: TripForm;
  let fixture: ComponentFixture<TripForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripForm],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
