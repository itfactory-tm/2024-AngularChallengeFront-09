import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayResponseDto } from '../../dtos/Day/day-response-dto';
import { baseUrl } from '../../../lib/constants';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  private apiUrl = `${baseUrl}/Days`;

  constructor(private http: HttpClient) {}

  getDays(): Observable<DayResponseDto[]> {
    return this.http.get<DayResponseDto[]>(this.apiUrl);
  }
}
