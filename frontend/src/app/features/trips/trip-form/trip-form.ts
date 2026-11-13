import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TripService } from '../../../core/services/trip';
import { Toast } from '../../../core/services/toast';
import { CreateTripRequest } from '../../../core/models/trip';

@Component({
  selector: 'app-trip-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss',
})
export class TripForm implements OnInit {
  tripId = signal<number | null>(null);
  loaded = signal(true);

  tripForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    status: new FormControl('DRAFT', [Validators.required]),
  });

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: Toast,
    private title: Title,
  ) {}

  ngOnInit() {
    const raw = this.route.snapshot.paramMap.get('id');
    if (!raw) {
      return;
    }
    const id = Number(raw);
    this.tripId.set(id);
    this.loaded.set(false);
    this.tripService.getTrip(id).subscribe({
      next: (trip) => {
        this.tripForm.patchValue({
          title: trip.title,
          description: trip.description,
          startDate: trip.startDate,
          endDate: trip.endDate,
          status: trip.status,
        });
        this.title.setTitle(`Modifier ${trip.title} — Itineria`);
        this.loaded.set(true);
      },
      error: () => {
        this.toast.error('Impossible de charger le voyage');
        this.loaded.set(true);
        this.router.navigate(['/trips']);
      },
    });
  }

  onSubmit() {
    if (this.tripForm.invalid) return;
    const data = this.tripForm.value as CreateTripRequest;
    const id = this.tripId();
    if (id == null) {
      this.tripService.createTrip(data).subscribe({
        next: () => {
          this.toast.success('Voyage créé');
          this.router.navigate(['/trips']);
        },
        error: () => this.toast.error('Impossible de créer le voyage'),
      });
      return;
    }
    this.tripService.updateTrip(id, data).subscribe({
      next: () => {
        this.toast.success('Voyage modifié');
        this.router.navigate(['/trips', id]);
      },
      error: () => this.toast.error('Impossible de modifier le voyage'),
    });
  }
}
