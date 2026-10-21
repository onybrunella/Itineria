import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { TripList } from './features/trips/trip-list/trip-list';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/auth/register/register';
import { TripForm } from './features/trips/trip-form/trip-form';
import { TripDetail } from './features/trips/trip-detail/trip-detail';
import { StepForm } from './features/steps/step-form/step-form';
import { TripScrapbook } from './features/photos/trip-scrapbook/trip-scrapbook';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'trips', component: TripList, canActivate: [authGuard] },
  { path: 'trips/new', component: TripForm, canActivate: [authGuard] },
  { path: 'trips/:id/steps/new', component: StepForm, canActivate: [authGuard] },
  { path: 'trips/:id/scrapbook', component: TripScrapbook, canActivate: [authGuard] },
  { path: 'trips/:id', component: TripDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
  
];