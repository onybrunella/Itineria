import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TripService } from '../../../core/services/trip';
import { StepService } from '../../../core/services/step';
import { PhotoService } from '../../../core/services/photo';
import { Trip } from '../../../core/models/trip';
import { Step } from '../../../core/models/step';

interface ScrapbookPage {
  step: Step;
  imageUrls: string[];
}

@Component({
  selector: 'app-trip-scrapbook',
  imports: [RouterLink],
  templateUrl: './trip-scrapbook.html',
  styleUrl: './trip-scrapbook.scss',
})
export class TripScrapbook implements OnInit, OnDestroy {
  trip = signal<Trip | null>(null);
  pages = signal<ScrapbookPage[]>([]);

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private stepService: StepService,
    private photoService: PhotoService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTrip(id).subscribe({
      next: (data) => this.trip.set(data),
      error: (err) => console.error('Erreur chargement du voyage', err),
    });
    this.stepService.getSteps(id).subscribe({
      next: (data) => this.loadPages([...data].sort((a, b) => a.orderIndex - b.orderIndex)),
      error: (err) => console.error('Erreur chargement des etapes', err),
    });
  }

  ngOnDestroy() {
    this.revokeAll();
  }

  private loadPages(steps: Step[]) {
    this.revokeAll();
    if (steps.length === 0) {
      this.pages.set([]);
      return;
    }

    const pageLoads = steps.map((step) =>
      this.photoService.getPhotos(step.id).pipe(
        switchMap((photos) => {
          if (photos.length === 0) {
            return of<ScrapbookPage>({ step, imageUrls: [] });
          }
          return forkJoin(photos.map((photo) => this.photoService.getPhotoFile(step.id, photo.id))).pipe(
            map((blobs) => ({
              step,
              imageUrls: blobs.map((blob) => URL.createObjectURL(blob)),
            })),
          );
        }),
      ),
    );

    forkJoin(pageLoads).subscribe({
      next: (pages) => {
        this.pages.set(pages);
        this.scrollToFragment();
      },
      error: (err) => console.error('Erreur chargement du carnet', err),
    });
  }

  private scrollToFragment() {
    const fragment = this.route.snapshot.fragment;
    if (!fragment) {
      return;
    }
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(fragment);
      if (!el) {
        if (attempts < 40) {
          setTimeout(() => tryScroll(attempts + 1), 50);
        }
        return;
      }
      const pending = Array.from(document.images).filter((img) => !img.complete);
      if (pending.length && attempts < 40) {
        setTimeout(() => tryScroll(attempts + 1), 50);
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    tryScroll();
  }

  private revokeAll() {
    for (const page of this.pages()) {
      for (const url of page.imageUrls) {
        URL.revokeObjectURL(url);
      }
    }
  }
}
