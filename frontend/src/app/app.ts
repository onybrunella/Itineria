import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';
import { Toast } from './core/services/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor(
    readonly toast: Toast,
    readonly auth: Auth,
    private router: Router,
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
