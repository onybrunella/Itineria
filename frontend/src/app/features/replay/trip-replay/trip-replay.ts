import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TripService } from '../../../core/services/trip';
import { StepService } from '../../../core/services/step';
import { Trip } from '../../../core/models/trip';
import { Step } from '../../../core/models/step';
import { TripMap } from '../../trips/trip-map/trip-map';

const STEP_MS = 2000;

@Component({
  selector: 'app-trip-replay',
  imports: [RouterLink, TripMap],
  templateUrl: './trip-replay.html',
  styleUrl: './trip-replay.scss',
})
export class TripReplay implements OnInit, OnDestroy {
  trip = signal<Trip | null>(null);
  steps = signal<Step[]>([]);
  index = signal(0);
  playing = signal(false);

  currentStep = computed(() => {
    const list = this.steps();
    return list[this.index()] ?? null;
  });

  private timer: ReturnType<typeof setInterval> | null = null;

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
      next: (data) => this.steps.set([...data].sort((a, b) => a.orderIndex - b.orderIndex)),
      error: (err) => console.error('Erreur chargement des etapes', err),
    });
  }

  ngOnDestroy() {
    this.pause();
  }

  play() {
    if (this.playing() || this.steps().length === 0) {
      return;
    }
    if (this.index() >= this.steps().length - 1) {
      this.index.set(0);
    }
    this.playing.set(true);
    this.timer = setInterval(() => this.advance(), STEP_MS);
  }

  pause() {
    this.playing.set(false);
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  next() {
    this.pause();
    this.advance();
  }

  onSelectStep(step: Step) {
    this.pause();
    const i = this.steps().findIndex((item) => item.id === step.id);
    if (i >= 0) {
      this.index.set(i);
    }
  }

  private advance() {
    const next = this.index() + 1;
    if (next >= this.steps().length) {
      this.pause();
      return;
    }
    this.index.set(next);
  }
}
