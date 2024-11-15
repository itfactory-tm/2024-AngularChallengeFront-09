import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArtistDto } from '../dtos/artist-dto';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  baseUrl: string = "https://localhost:7091";

  constructor(private http: HttpClient) { }

  getArtists(): Observable<ArtistDto[]> {
    return this.http.get<ArtistDto[]>(this.baseUrl + "/api/Artists");
  }
}
