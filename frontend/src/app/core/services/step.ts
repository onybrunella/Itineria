import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Step, CreateStepRequest } from '../models/step';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private apiUrl = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) {}

  private stepsUrl(tripId: number): string {
    return `${this.apiUrl}/${tripId}/steps`;
  }

  getSteps(tripId: number): Observable<Step[]> {
    return this.http.get<Step[]>(this.stepsUrl(tripId));
  }

  createStep(tripId: number, data: CreateStepRequest): Observable<Step> {
    return this.http.post<Step>(this.stepsUrl(tripId), data);
  }

  updateStep(tripId: number, stepId: number, data: CreateStepRequest): Observable<Step> {
    return this.http.put<Step>(`${this.stepsUrl(tripId)}/${stepId}`, data);
  }

  deleteStep(tripId: number, stepId: number): Observable<void> {
    return this.http.delete<void>(`${this.stepsUrl(tripId)}/${stepId}`);
  }
}
