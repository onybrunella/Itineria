import { Component, effect, input, OnDestroy, signal, untracked } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PhotoService } from '../../../core/services/photo';

@Component({
  selector: 'app-step-photos',
  imports: [],
  templateUrl: './step-photos.html',
  styleUrl: './step-photos.scss',
})
export class StepPhotos implements OnDestroy {
  stepId = input<number | null>(null);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  imageUrls = signal<string[]>([]);

  constructor(private photoService: PhotoService) {
    effect(() => {
      const id = this.stepId();
      untracked(() => {
        this.resetPreview();
        this.revokeImages();
        this.imageUrls.set([]);
        if (id != null) {
          this.loadPhotos(id);
        }
      });
    });
  }

  onFileChosen(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.resetPreview();
    this.selectedFile.set(file);
    if (file) {
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  upload() {
    const stepId = this.stepId();
    const file = this.selectedFile();
    if (stepId == null || !file) {
      return;
    }
    this.photoService.uploadPhoto(stepId, file).subscribe({
      next: () => {
        this.resetPreview();
        this.loadPhotos(stepId);
      },
      error: (err) => console.error('Erreur upload photo', err),
    });
  }

  ngOnDestroy() {
    this.resetPreview();
    this.revokeImages();
  }

  private loadPhotos(stepId: number) {
    this.photoService.getPhotos(stepId).subscribe({
      next: (photos) => {
        if (photos.length === 0) {
          this.revokeImages();
          this.imageUrls.set([]);
          return;
        }
        forkJoin(photos.map((photo) => this.photoService.getPhotoFile(stepId, photo.id))).subscribe({
          next: (blobs) => {
            this.revokeImages();
            this.imageUrls.set(blobs.map((blob) => URL.createObjectURL(blob)));
          },
          error: (err) => console.error('Erreur chargement des fichiers photo', err),
        });
      },
      error: (err) => console.error('Erreur chargement des photos', err),
    });
  }

  private resetPreview() {
    const preview = this.previewUrl();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    this.previewUrl.set(null);
    this.selectedFile.set(null);
  }

  private revokeImages() {
    for (const url of this.imageUrls()) {
      URL.revokeObjectURL(url);
    }
  }
}
