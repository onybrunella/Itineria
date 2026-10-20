import { Component, computed, effect, input, OnDestroy, signal } from '@angular/core';
import { LeafletDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { Step } from '../../../core/models/step';

const markerIcon = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-trip-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  templateUrl: './trip-map.html',
  styleUrl: './trip-map.scss',
})
export class TripMap implements OnDestroy {
  steps = input<Step[]>([]);

  private map = signal<L.Map | null>(null);
  private line?: L.Polyline;
  private animationId = 0;

  options: L.MapOptions = {
    zoom: 5,
    center: L.latLng(46.5, 2.5),
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }),
    ],
  };

  layers = computed(() => {
    const sorted = [...this.steps()].sort((a, b) => a.orderIndex - b.orderIndex);
    return sorted.map((step) =>
      L.marker([step.latitude, step.longitude], { icon: markerIcon }).bindPopup(step.locationName),
    );
  });

  fitBounds = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) {
      return L.latLngBounds([
        [41, -5],
        [51, 10],
      ]);
    }
    return L.latLngBounds(steps.map((step) => [step.latitude, step.longitude] as L.LatLngTuple));
  });

  constructor() {
    effect(() => {
      this.startAnimation(this.map(), this.steps());
    });
  }

  onMapReady(map: L.Map) {
    this.map.set(map);
  }

  ngOnDestroy() {
    this.stopAnimation();
    this.line?.remove();
  }

  private startAnimation(map: L.Map | null, steps: Step[]) {
    this.stopAnimation();
    if (!map) {
      return;
    }

    if (!this.line) {
      this.line = L.polyline([], { color: '#2563eb' }).addTo(map);
    } else {
      this.line.setLatLngs([]);
    }

    const sorted = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);
    if (sorted.length < 2) {
      return;
    }

    const path = this.interpolate(sorted);
    let index = 0;
    const tick = () => {
      index = Math.min(index + 4, path.length);
      this.line?.setLatLngs(path.slice(0, index));
      if (index < path.length) {
        this.animationId = requestAnimationFrame(tick);
      }
    };
    this.animationId = requestAnimationFrame(tick);
  }

  private interpolate(steps: Step[]): L.LatLngExpression[] {
    const points: L.LatLngExpression[] = [];
    const perSegment = 40;
    for (let i = 0; i < steps.length - 1; i++) {
      const from = steps[i];
      const to = steps[i + 1];
      for (let step = 0; step < perSegment; step++) {
        const t = step / perSegment;
        points.push([
          from.latitude + (to.latitude - from.latitude) * t,
          from.longitude + (to.longitude - from.longitude) * t,
        ]);
      }
    }
    const last = steps[steps.length - 1];
    points.push([last.latitude, last.longitude]);
    return points;
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }
}
