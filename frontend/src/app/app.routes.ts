import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { TripList } from './features/trips/trip-list/trip-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'trips', component: TripList },
];