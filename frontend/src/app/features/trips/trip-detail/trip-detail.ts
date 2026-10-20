import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TripService } from '../../../core/services/trip';
import { StepService } from '../../../core/services/step';
import { Trip } from '../../../core/models/trip';
import { Step } from '../../../core/models/step';
import { TripMap } from '../trip-map/trip-map';

@Component({
  selector: 'app-trip-detail',
  imports: [RouterLink, TripMap],
  templateUrl: './trip-detail.html',
  styleUrl: './trip-detail.scss',
})
export class TripDetail implements OnInit {
  trip = signal<Trip | null>(null);
  steps = signal<Step[]>([]);

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private stepService: StepService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTrip(id).subscribe({
      next: (data) => this.trip.set(data),
      error: (err) => console.error('Erreur chargement du voyage', err),
    });
    this.stepService.getSteps(id).subscribe({
      next: (data) => this.steps.set(data),
      error: (err) => console.error('Erreur chargement des etapes', err),
    });
  }
}
