import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StageDto } from '../../dtos/stage-dto';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private baseUrl: string = "https://localhost:7091";

  constructor(private http: HttpClient) { }

  getStages(): Observable<StageDto[]>{
    return this.http.get<StageDto[]>(this.baseUrl + "/api/Stages");
  }

  getStageById(id: StageDto): Observable<StageDto>{
    return this.http.get<StageDto>(this.baseUrl + "/api/Stages/" + id)
  }

  addStage(ticket: StageDto): Observable<StageDto>{
    return this.http.post<StageDto>(this.baseUrl + "/api/Stages", ticket).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = (error.status === 400) ? error.error : "Er is een onverwachte fout opgetreden.";
    return throwError(() => new Error(errorMessage));
  }
}
