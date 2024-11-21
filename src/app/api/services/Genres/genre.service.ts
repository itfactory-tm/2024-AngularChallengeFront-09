import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../dtos/Genre/genre-response-dto';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private baseUrl: string = "https://localhost:7091/api/Genres";

  constructor(private http: HttpClient) { }

  getGenres(): Observable<GenreResponseDto[]> {
    return this.http.get<GenreResponseDto[]>(this.baseUrl);
  }
}
