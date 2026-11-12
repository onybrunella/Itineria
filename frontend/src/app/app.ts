import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const THEME_KEY = 'itineria-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly themes = [
    { id: 'soleil', label: '1 Prairie + soleil' },
    { id: 'cacao', label: '2 Côte + cacao' },
  ];

  theme = signal('soleil');

  constructor() {
    const saved = localStorage.getItem(THEME_KEY);
    const id = this.themes.some((item) => item.id === saved) ? saved! : 'soleil';
    this.theme.set(id);
    this.apply(id);
  }

  setTheme(id: string) {
    this.theme.set(id);
    localStorage.setItem(THEME_KEY, id);
    this.apply(id);
  }

  private apply(id: string) {
    document.documentElement.dataset['theme'] = id;
    window.dispatchEvent(new Event('itineria-theme'));
  }
}
