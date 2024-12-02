import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PerformanceResponseDto } from '../../dtos/Performance/performance-response-dto';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { PerformanceRequestDto } from '../../dtos/Performance/performance-request-dto';

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private apiUrl = `${environment.baseUrl}/Performances`;
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

  getPerformances(): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(this.apiUrl);
  }

  getPerformancesByDay(id: string): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(`${this.apiUrl}/day/${id}`);
  }
  getPerformancesByArtist(id: string): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(
      `${this.apiUrl}/artist/${id}`
    );
  }
  getPerformancesByStageAndDay( stageId:string,dayId: string): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(
      `${this.apiUrl}/stage/${stageId}/day/${dayId}`
    );
  }

  deletePerformance(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  editPerformance(id: string, performance: PerformanceRequestDto) {
    return this.http.put<PerformanceRequestDto>(
      `${this.apiUrl}/${id}`,
      performance,
      { headers: this.headers }
    );
  }

  addPerformance(
    performance: PerformanceRequestDto
  ): Observable<PerformanceRequestDto> {
    return this.http
      .post<PerformanceRequestDto>(this.apiUrl, performance, {
        headers: this.headers,
      })
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
