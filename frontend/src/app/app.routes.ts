import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { TripList } from './features/trips/trip-list/trip-list';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
      { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'login', component: Login },
  {path:'register', component: Register},
  { path: 'trips', component: TripList, canActivate: [authGuard] },

];