import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ArtistResponseDto } from '../../dtos/Artist/artist-response-dto';
import { ArtistRequestDto } from '../../dtos/Artist/artist-request-dto';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private baseUrl: string = "https://localhost:7091/api/Artists";

  constructor(private http: HttpClient) { }

  getArtists(): Observable<ArtistResponseDto[]> {
    return this.http.get<ArtistResponseDto[]>(this.baseUrl);
  }

  getARtistsByDay(id: string): Observable<ArtistResponseDto[]> {
    return this.http.get<ArtistResponseDto[]>(`${this.baseUrl}/day/${id}`);
  }

  addArtist(artist: ArtistRequestDto): Observable<ArtistRequestDto> {
    return this.http.post<ArtistRequestDto>(this.baseUrl, artist).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = (error.status === 400) ? error.error : "Er is een onverwachte fout opgetreden.";
    return throwError(() => new Error(errorMessage));
  }
}
