import { Component, OnInit, signal } from '@angular/core';
import { TripService } from '../../../core/services/trip';
import { Trip } from '../../../core/models/trip';

@Component({
  selector: 'app-trip-list',
  imports: [],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList implements OnInit {
  trips = signal<Trip[]>([]);

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data) => this.trips.set(data),
      error: (err) => console.error('Erreur chargement voyages', err),
    });
  }
}
