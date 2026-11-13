import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TripService } from '../../../core/services/trip';
import { StepService } from '../../../core/services/step';
import { Trip } from '../../../core/models/trip';
import { Step } from '../../../core/models/step';
import { TripMap } from '../trip-map/trip-map';
import { TripTimeline } from '../trip-timeline/trip-timeline';
import { StepPhotos } from '../../photos/step-photos/step-photos';

@Component({
  selector: 'app-trip-detail',
  imports: [RouterLink, TripMap, TripTimeline, StepPhotos],
  templateUrl: './trip-detail.html',
  styleUrl: './trip-detail.scss',
})
export class TripDetail implements OnInit {
  trip = signal<Trip | null>(null);
  steps = signal<Step[]>([]);
  stepsLoaded = signal(false);
  selectedStep = signal<Step | null>(null);

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private stepService: StepService,
    private title: Title,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTrip(id).subscribe({
      next: (data) => {
        this.trip.set(data);
        this.title.setTitle(`${data.title} — Itineria`);
      },
      error: (err) => console.error('Erreur chargement du voyage', err),
    });
    this.stepService.getSteps(id).subscribe({
      next: (data) => {
        this.steps.set(data);
        this.stepsLoaded.set(true);
        this.selectFromQuery(data);
      },
      error: (err) => {
        console.error('Erreur chargement des etapes', err);
        this.stepsLoaded.set(true);
      },
    });
  }

  onSelectStep(step: Step) {
    this.selectedStep.set(step);
  }

  private selectFromQuery(steps: Step[]) {
    const raw = this.route.snapshot.queryParamMap.get('step');
    if (!raw) {
      return;
    }
    const found = steps.find((step) => step.id === Number(raw));
    if (found) {
      this.selectedStep.set(found);
    }
  }
}
