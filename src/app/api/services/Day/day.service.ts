import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayResponseDto } from '../../dtos/Day/day-response-dto';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private baseUrl: string = "https://localhost:7091/api/Days";

  constructor(private http: HttpClient) { }

  getDays(): Observable<DayResponseDto[]> {
    return this.http.get<DayResponseDto[]>(this.baseUrl);
  }
}
