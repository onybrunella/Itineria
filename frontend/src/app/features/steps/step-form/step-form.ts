import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StepService } from '../../../core/services/step';
import { CreateStepRequest } from '../../../core/models/step';

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-step-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './step-form.html',
  styleUrl: './step-form.scss',
})
export class StepForm implements OnInit {
  tripId = 0;
  suggestions = signal<NominatimPlace[]>([]);

  searchQuery = new FormControl('', { nonNullable: true });

  stepForm = new FormGroup({
    locationName: new FormControl('', [Validators.required]),
    latitude: new FormControl<number | null>(null, [Validators.required]),
    longitude: new FormControl<number | null>(null, [Validators.required]),
    date: new FormControl('', [Validators.required]),
    note: new FormControl(''),
    orderIndex: new FormControl(0, [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private stepService: StepService,
  ) {}

  ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.stepService.getSteps(this.tripId).subscribe({
      next: (steps) => this.stepForm.patchValue({ orderIndex: steps.length }),
      error: (err) => console.error('Erreur chargement des etapes', err),
    });
  }

  searchPlace() {
    const q = this.searchQuery.value.trim();
    if (!q) return;

    this.http
      .get<NominatimPlace[]>('https://nominatim.openstreetmap.org/search', {
        params: { q, format: 'json', limit: 5 },
        headers: { 'Accept-Language': 'fr' },
      })
      .subscribe({
        next: (places) => this.suggestions.set(places),
        error: (err) => console.error('Erreur recherche Nominatim', err),
      });
  }

  selectPlace(place: NominatimPlace) {
    this.stepForm.patchValue({
      locationName: place.display_name,
      latitude: Number(place.lat),
      longitude: Number(place.lon),
    });
    this.suggestions.set([]);
  }

  onSubmit() {
    if (this.stepForm.invalid) return;
    this.stepService.createStep(this.tripId, this.stepForm.value as CreateStepRequest).subscribe({
      next: () => this.router.navigate(['/trips', this.tripId]),
      error: (err) => console.error("Erreur creation d'etape", err),
    });
  }
}
