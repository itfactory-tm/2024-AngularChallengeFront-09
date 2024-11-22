import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ArtistResponseDto } from '../../dtos/Artist/artist-response-dto';
import { ArtistRequestDto } from '../../dtos/Artist/artist-request-dto';
import { baseUrl } from '../../../lib/constants';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = `${baseUrl}/Artists`;

  constructor(private http: HttpClient) {}

  getArtists(): Observable<ArtistResponseDto[]> {
    return this.http.get<ArtistResponseDto[]>(this.apiUrl);
  }

  getArtistsByDay(id: string): Observable<ArtistResponseDto[]> {
    return this.http.get<ArtistResponseDto[]>(`${this.apiUrl}/day/${id}`);
  }

  getArtistsByGenre(id: string): Observable<ArtistResponseDto[]> {
    return this.http.get<ArtistResponseDto[]>(`${this.apiUrl}/genre/${id}`);
  }

  addArtist(artist: ArtistRequestDto): Observable<ArtistRequestDto> {
    return this.http
      .post<ArtistRequestDto>(this.apiUrl, artist)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
