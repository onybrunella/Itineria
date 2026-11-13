import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
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
  stepsLoaded = signal(false);
  index = signal(0);
  playing = signal(false);
  finished = signal(false);

  currentStep = computed(() => {
    const list = this.steps();
    return list[this.index()] ?? null;
  });

  stats = computed(() => {
    const trip = this.trip();
    const steps = this.steps();
    if (!trip || steps.length === 0) {
      return null;
    }
    let km = 0;
    for (let i = 0; i < steps.length - 1; i++) {
      km += distanceKm(steps[i], steps[i + 1]);
    }
    return {
      places: steps.length,
      km: Math.round(km * 10) / 10,
      days: daysBetween(trip.startDate, trip.endDate),
    };
  });

  private timer: ReturnType<typeof setInterval> | null = null;

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
        this.title.setTitle(`${data.title} — replay — Itineria`);
      },
      error: (err) => console.error('Erreur chargement du voyage', err),
    });
    this.stepService.getSteps(id).subscribe({
      next: (data) => {
        this.steps.set([...data].sort((a, b) => a.orderIndex - b.orderIndex));
        this.stepsLoaded.set(true);
      },
      error: (err) => {
        console.error('Erreur chargement des etapes', err);
        this.stepsLoaded.set(true);
      },
    });
  }

  ngOnDestroy() {
    this.pause();
  }

  play() {
    if (this.playing() || this.steps().length === 0) {
      return;
    }
    this.finished.set(false);
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
    this.finished.set(false);
    const i = this.steps().findIndex((item) => item.id === step.id);
    if (i >= 0) {
      this.index.set(i);
    }
  }

  private advance() {
    const next = this.index() + 1;
    if (next >= this.steps().length) {
      this.pause();
      this.finished.set(true);
      return;
    }
    this.index.set(next);
  }
}

function distanceKm(from: Step, to: Step): number {
  const earthKm = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(h)));
}

function daysBetween(start: string, end: string): number {
  const from = new Date(`${start}T00:00:00`);
  const to = new Date(`${end}T00:00:00`);
  const diff = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  return Math.max(0, diff);
}
