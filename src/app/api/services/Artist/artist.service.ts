import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ArtistResponseDto } from '../../dtos/Artist/artist-response-dto';
import { ArtistRequestDto } from '../../dtos/Artist/artist-request-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  // private apiUrl = `${environment.baseUrl}/Artists`;
  private apiUrl = `https://localhost:7091/api/Artists`;

  private artistsSubject = new BehaviorSubject<ArtistResponseDto[]>([]);
  artists$: Observable<ArtistResponseDto[]> = this.artistsSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  editArtist(artist: ArtistRequestDto) {
    return this.http.put<ArtistRequestDto>(`${this.apiUrl}/${artist.id}`, artist);
  }

  deleteArtist(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addArtist(artist: ArtistRequestDto): Observable<ArtistRequestDto> {
    return this.http.post<ArtistRequestDto>(this.apiUrl, artist)
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
