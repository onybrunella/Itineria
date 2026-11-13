import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './core/services/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor(readonly toast: Toast) {}
}
