import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { TripList } from './features/trips/trip-list/trip-list';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/auth/register/register';
import { TripForm } from './features/trips/trip-form/trip-form';
import { TripDetail } from './features/trips/trip-detail/trip-detail';
import { StepForm } from './features/steps/step-form/step-form';
import { TripScrapbook } from './features/photos/trip-scrapbook/trip-scrapbook';
import { TripReplay } from './features/replay/trip-replay/trip-replay';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Connexion — Itineria' },
  { path: 'register', component: Register, title: 'Inscription — Itineria' },
  { path: 'trips', component: TripList, canActivate: [authGuard], title: 'Mes voyages — Itineria' },
  { path: 'trips/new', component: TripForm, canActivate: [authGuard], title: 'Nouveau voyage — Itineria' },
  { path: 'trips/:id/steps/new', component: StepForm, canActivate: [authGuard], title: 'Nouvelle étape — Itineria' },
  { path: 'trips/:id/scrapbook', component: TripScrapbook, canActivate: [authGuard], title: 'Carnet — Itineria' },
  { path: 'trips/:id/replay', component: TripReplay, canActivate: [authGuard], title: 'Replay — Itineria' },
  { path: 'trips/:id', component: TripDetail, canActivate: [authGuard], title: 'Voyage — Itineria' },
  { path: '**', redirectTo: 'login' },
  
];