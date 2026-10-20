import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../../core/services/trip';
import { CreateTripRequest } from '../../../core/models/trip';

@Component({
  selector: 'app-trip-form',
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss',
})
export class TripForm {

  constructor(private tripService: TripService, private router: Router) {}

  tripForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    status: new FormControl('DRAFT', [Validators.required]),
  });

  onSubmit() {
    if (this.tripForm.invalid) return;
    this.tripService.createTrip(this.tripForm.value as CreateTripRequest).subscribe({
      next: () => this.router.navigate(['/trips']),
      error: (err) => console.error('Erreur création voyage', err),
    });
  }
}