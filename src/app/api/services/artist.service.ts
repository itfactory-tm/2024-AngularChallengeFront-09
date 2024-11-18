import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ArtisResponsetDto } from '../dtos/artist-response-dto';
import { ArtistRequestDto } from '../dtos/artist-request-dto';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private baseUrl: string = "https://localhost:7091";

  constructor(private http: HttpClient) { }

  getArtists(): Observable<ArtisResponsetDto[]> {
    return this.http.get<ArtisResponsetDto[]>(this.baseUrl + "/api/Artists");
  }

  addArtist(artist: ArtistRequestDto): Observable<ArtistRequestDto> {
    return this.http.post<ArtistRequestDto>(this.baseUrl + "/api/Artists", artist).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = (error.status === 400) ? error.error : "Er is een onverwachte fout opgetreden.";
    return throwError(() => new Error(errorMessage));
  }
}
