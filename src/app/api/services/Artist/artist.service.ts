import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ArtistResponseDto } from '../../dtos/Artist/artist-response-dto';
import { ArtistRequestDto } from '../../dtos/Artist/artist-request-dto';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = `${environment.baseUrl}/Artists`;
  private headers: HttpHeaders | undefined;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }

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
      .post<ArtistRequestDto>(this.apiUrl, artist, { headers: this.headers })
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
