import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl = 'http://localhost:8080/api/steps';

  constructor(private http: HttpClient) {}

  private photosUrl(stepId: number): string {
    return `${this.apiUrl}/${stepId}/photos`;
  }

  getPhotos(stepId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.photosUrl(stepId));
  }

  uploadPhoto(stepId: number, file: File): Observable<Photo> {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<Photo>(this.photosUrl(stepId), body);
  }

  getPhotoFile(stepId: number, photoId: number): Observable<Blob> {
    return this.http.get(this.photosUrl(stepId) + `/${photoId}/file`, {
      responseType: 'blob',
    });
  }

  deletePhoto(stepId: number, photoId: number): Observable<void> {
    return this.http.delete<void>(`${this.photosUrl(stepId)}/${photoId}`);
  }
}
