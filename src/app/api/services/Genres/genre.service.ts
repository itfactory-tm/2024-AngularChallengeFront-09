import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../dtos/Genre/genre-response-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = `${environment.baseUrl}/Genres`;

  constructor(private http: HttpClient) {}

  getGenres(): Observable<GenreResponseDto[]> {
    return this.http.get<GenreResponseDto[]>(this.apiUrl);
  }
}
