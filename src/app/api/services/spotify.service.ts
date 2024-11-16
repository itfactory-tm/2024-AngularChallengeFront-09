import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtisResponsetDto } from '../dtos/artist-response-dto';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  baseUrl: string = "https://localhost:7091";

  constructor(private http: HttpClient) { }

  getArtists(): Observable<ArtisResponsetDto[]> {
    return this.http.get<ArtisResponsetDto[]>(this.baseUrl + "/api/Artists");
  }
}
