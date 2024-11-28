import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { StageDto } from '../../dtos/stage-dto';
import { environment } from '../../../../environments/environment';
import slug from 'slug';
import { AuthService } from '@auth0/auth0-angular';
import { StageResponseDto } from '../../dtos/Stage/stage-response-dto';
import { StageRequestDto } from '../../dtos/Stage/stage-request-dto';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private apiUrl = `${environment.baseUrl}/Stages`;
  private headers: HttpHeaders | undefined;
  private stagesSubject = new BehaviorSubject<StageResponseDto[]>([]);
  stages$: Observable<StageResponseDto[]> = this.stagesSubject.asObservable();


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
  fetchStages(): void {
    this.http.get<StageResponseDto[]>(this.apiUrl).subscribe((stages) => {
      this.stagesSubject.next(stages);
    });
  }

  deleteStage(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  updateStage(id: string, stage: StageRequestDto) {
    return this.http.put<StageRequestDto>(`${this.apiUrl}/${id}`, stage, { headers: this.headers });
  }

  getStages(): Observable<StageDto[]> {
    return this.http.get<StageDto[]>(this.apiUrl);
  }

  getStageById(id: StageDto): Observable<StageDto> {
    return this.http.get<StageDto>(`this.apiUrl/${id}`);
  }

  addStage(ticket: StageRequestDto): Observable<StageDto> {
    return this.http
      .post<StageDto>(this.apiUrl, ticket, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
  getStageBySlug(urlSlug: string): Observable<StageDto> {
    return this.getStages().pipe(
      map(stages => {
        const stage = stages.find(stage => slug(stage.name) === urlSlug);

        if (!stage) {
          throw new Error('Stage not found');
        }

        return stage;
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
