import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerformanceResponseDto } from '../../dtos/Performance/performance-response-dto';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private baseUrl: string = "https://localhost:7091/api/Performances";

  constructor(private http: HttpClient) { }

  getPerformances(): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(this.baseUrl);
  }

  getPerformancesByDay(id: string): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(`${this.baseUrl}/day/${id}`);
  }
  getPerformancesByArtist(id: string): Observable<PerformanceResponseDto[]> {
    return this.http.get<PerformanceResponseDto[]>(`${this.baseUrl}/artist/${id}`);
  }
  
}
