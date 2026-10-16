import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { TripList } from './features/trips/trip-list/trip-list';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'trips', component: TripList, canActivate: [authGuard] }
];