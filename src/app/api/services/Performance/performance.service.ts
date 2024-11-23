import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerformanceResponseDto } from '../../dtos/Performance/performance-response-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private apiUrl = `${environment.baseUrl}/Performances`;

  constructor(private http: HttpClient) {}

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
}
