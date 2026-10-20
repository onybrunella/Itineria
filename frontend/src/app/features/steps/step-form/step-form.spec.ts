import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StepForm } from './step-form';
import { StepService } from '../../../core/services/step';

describe('StepForm', () => {
  let component: StepForm;
  let fixture: ComponentFixture<StepForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepForm],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: StepService, useValue: { getSteps: () => of([]), createStep: () => of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StepForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
