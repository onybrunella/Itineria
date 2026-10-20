import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TripService } from '../../../core/services/trip';
import { Trip } from '../../../core/models/trip';

@Component({
  selector: 'app-trip-detail',
  imports: [RouterLink],
  templateUrl: './trip-detail.html',
  styleUrl: './trip-detail.scss',
})
export class TripDetail implements OnInit {
  trip = signal<Trip | null>(null);

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTrip(id).subscribe({
      next: (data) => this.trip.set(data),
      error: (err) => console.error('Erreur chargement du voyage', err),
    });
  }
}
