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
  { path: 'login', component: Login, title: 'Connexion' },
  { path: 'register', component: Register, title: 'Inscription' },
  { path: 'trips', component: TripList, canActivate: [authGuard], title: 'Mes voyages' },
  { path: 'trips/new', component: TripForm, canActivate: [authGuard], title: 'Nouveau voyage' },
  { path: 'trips/:id/edit', component: TripForm, canActivate: [authGuard], title: 'Modifier le voyage' },
  { path: 'trips/:id/steps/new', component: StepForm, canActivate: [authGuard], title: 'Nouvelle étape' },
  { path: 'trips/:id/scrapbook', component: TripScrapbook, canActivate: [authGuard], title: 'Carnet' },
  { path: 'trips/:id/replay', component: TripReplay, canActivate: [authGuard], title: 'Replay' },
  { path: 'trips/:id/steps/:stepId/edit', component: StepForm, canActivate: [authGuard], title: "Modifier l'étape"},
  { path: 'trips/:id', component: TripDetail, canActivate: [authGuard], title: 'Voyage' },
  { path: '**', redirectTo: 'login' },
  
];