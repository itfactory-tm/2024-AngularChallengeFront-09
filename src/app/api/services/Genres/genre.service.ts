import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../dtos/Genre/genre-response-dto';
import { baseUrl } from '../../../lib/constants';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = `${baseUrl}/Genres`;

  constructor(private http: HttpClient) {}

  getGenres(): Observable<GenreResponseDto[]> {
    return this.http.get<GenreResponseDto[]>(this.apiUrl);
  }
}
