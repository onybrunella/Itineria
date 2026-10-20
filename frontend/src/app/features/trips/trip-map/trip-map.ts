import { Component, computed, input } from '@angular/core';
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
export class TripMap {
  steps = input<Step[]>([]);

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
    const markers = sorted.map((step) =>
      L.marker([step.latitude, step.longitude], { icon: markerIcon }).bindPopup(step.locationName),
    );
    const result: L.Layer[] = [...markers];
    if (sorted.length >= 2) {
      result.push(
        L.polyline(
          sorted.map((step) => [step.latitude, step.longitude] as L.LatLngExpression),
          { color: '#2563eb' },
        ),
      );
    }
    return result;
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
}
