import { Component, input, output } from '@angular/core';
import { Step } from '../../../core/models/step';

@Component({
  selector: 'app-trip-timeline',
  imports: [],
  templateUrl: './trip-timeline.html',
  styleUrl: './trip-timeline.scss',
})
export class TripTimeline {
  steps = input<Step[]>([]);
  selectedId = input<number | null>(null);
  stepSelect = output<Step>();

  sortedSteps(): Step[] {
    return [...this.steps()].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  onSelect(step: Step) {
    this.stepSelect.emit(step);
  }
}
