import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip, CreateTripRequest } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class TripService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/trips';
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTrip(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  createTrip(data: CreateTripRequest): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, data);
  }

  updateTrip(id: number, data: CreateTripRequest): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, data);
  }

  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

