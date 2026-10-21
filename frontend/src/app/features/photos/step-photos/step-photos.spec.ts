import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPhotos } from './step-photos';

describe('StepPhotos', () => {
  let component: StepPhotos;
  let fixture: ComponentFixture<StepPhotos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPhotos],
    }).compileComponents();

    fixture = TestBed.createComponent(StepPhotos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
