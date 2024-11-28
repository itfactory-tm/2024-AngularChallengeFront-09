import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DayResponseDto } from '../../dtos/Day/day-response-dto';
import { environment } from '../../../../environments/environment';
import { DayRequestDto } from '../../dtos/Day/day-request-dto';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  private apiUrl = `${environment.baseUrl}/Days`;
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

  getDays(): Observable<DayResponseDto[]> {
    return this.http.get<DayResponseDto[]>(this.apiUrl);
  }

  addDay(day: DayRequestDto): Observable<DayResponseDto> {
    return this.http
      .post<DayResponseDto>(this.apiUrl, day, { headers: this.headers })
      .pipe(catchError(this.handleError));
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
