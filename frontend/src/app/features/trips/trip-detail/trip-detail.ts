import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TripService } from '../../../core/services/trip';
import { StepService } from '../../../core/services/step';
import { Toast } from '../../../core/services/toast';
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
  deleting = signal(false);
  deletingStep = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private stepService: StepService,
    private toast: Toast,
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

  deleteTrip() {
    const t = this.trip();
    if (!t || this.deleting()) {
      return;
    }
    const ok = window.confirm(`Supprimer « ${t.title} » ? Les étapes et photos seront également supprimés.`);
    if (!ok) {
      return;
    }
    this.deleting.set(true);
    this.tripService.deleteTrip(t.id).subscribe({
      next: () => {
        this.toast.success('Voyage supprimé');
        this.router.navigate(['/trips']);
      },
      error: () => {
        this.deleting.set(false);
        this.toast.error('Impossible de supprimer le voyage');
      },
    });
  }

  deleteStep(){
    const t = this.trip();
    const s = this.selectedStep();
    if (!t || !s || this.deletingStep()) {
      return;
    }
    const ok = window.confirm(`Supprimer « ${s.locationName} » ?`);
    if (!ok) {
      return;
    }
    this.deletingStep.set(true);
    this.stepService.deleteStep(t.id, s.id).subscribe({
      next: () => {
        this.toast.success('Étape supprimée');
        this.steps.set(this.steps().filter((step) => step.id !== s.id));
        this.selectedStep.set(null);
        this.deletingStep.set(false);
      },
      error : () => {
        this.deletingStep.set(false);
        this.toast.error("Impossible de supprimer l'étape");
      }
    })
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
