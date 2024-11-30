import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { GenreResponseDto } from '../../dtos/Genre/genre-response-dto';
import { environment } from '../../../../environments/environment';
import { GenreRequestDto } from '../../dtos/Genre/genre-request-dto';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = `${environment.baseUrl}/Genres`;
  private headers: HttpHeaders | undefined;
  private genresSubject = new BehaviorSubject<GenreResponseDto[]>([]);
  genres$: Observable<GenreResponseDto[]> =
    this.genresSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }

  // Methode om genres op te halen
  fetchGenres(): void {
    this.http.get<GenreResponseDto[]>(this.apiUrl).subscribe(genres => {
      this.genresSubject.next(genres);
    });
  }

  updateGenre(id: string, genre: GenreRequestDto) {
    return this.http.put<GenreRequestDto>(`${this.apiUrl}/${id}`, genre, {
      headers: this.headers,
    });
  }

  deleteGenre(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  addGenre(genre: GenreRequestDto): Observable<GenreRequestDto> {
    return this.http
      .post<GenreRequestDto>(this.apiUrl, genre, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getGenres(): Observable<GenreResponseDto[]> {
    return this.http.get<GenreResponseDto[]>(this.apiUrl);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.error);
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
