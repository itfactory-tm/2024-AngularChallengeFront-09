import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayResponseDto } from '../../dtos/Day/day-response-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  private apiUrl = `${environment.baseUrl}/Days`;

  constructor(private http: HttpClient) {}

  getDays(): Observable<DayResponseDto[]> {
    return this.http.get<DayResponseDto[]>(this.apiUrl);
  }
}
