import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
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

  fetchStages(): void {
    this.http.get<StageResponseDto[]>(this.apiUrl).subscribe(stages => {
      this.stagesSubject.next(stages);
    });
  }

  deleteStage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  updateStage(
    id: string,
    stage: StageRequestDto
  ): Observable<StageResponseDto> {
    this.headers?.append('Content-Type', 'multipart/form-data');
    const formData = new FormData();
    formData.append('name', stage.name);
    formData.append('description', stage.description);
    formData.append('capacity', stage.capacity.toString());
    formData.append('latitude', stage.latitude.toString());
    formData.append('longitude', stage.longitude.toString());

    // Append the file correctly
    if (stage.image) {
      formData.append('image', stage.image, stage.image.name);
    }
    return this.http.put<StageResponseDto>(`${this.apiUrl}/${id}`, formData, {
      headers: this.headers,
    });
  }

  getStages(): Observable<StageResponseDto[]> {
    return this.http.get<StageResponseDto[]>(this.apiUrl);
  }

  getStageById(id: string): Observable<StageResponseDto> {
    return this.http.get<StageResponseDto>(`${this.apiUrl}/${id}`);
  }

  addStage(stage: StageRequestDto): Observable<StageResponseDto> {
    this.headers?.append('Content-Type', 'multipart/form-data');
    const formData = new FormData();
    formData.append('name', stage.name);
    formData.append('description', stage.description);
    formData.append('capacity', stage.capacity.toString());
    formData.append('latitude', stage.latitude.toString());
    formData.append('longitude', stage.longitude.toString());

    // Append the file correctly
    if (stage.image) {
      formData.append('image', stage.image, stage.image.name);
    }
    return this.http
      .post<StageResponseDto>(this.apiUrl, formData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getStageBySlug(urlSlug: string): Observable<StageResponseDto> {
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
