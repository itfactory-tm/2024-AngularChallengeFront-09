import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
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
  private artistsSubject = new BehaviorSubject<ArtistResponseDto[]>([]);
  artists$: Observable<ArtistResponseDto[]> = this.artistsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }

  // Methode om artiesten op te halen
  fetchArtists(): void {
    this.http.get<ArtistResponseDto[]>(this.apiUrl).subscribe((artists) => {
      this.artistsSubject.next(artists);
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

  updateArtist(id: string, artist: ArtistRequestDto) {
    return this.http.put<ArtistRequestDto>(`${this.apiUrl}/${id}`, artist, { headers: this.headers });
  }

  deleteArtist(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  addArtist(artist: ArtistRequestDto): Observable<ArtistRequestDto> {
    return this.http
      .post<ArtistRequestDto>(this.apiUrl, artist, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.error)
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
