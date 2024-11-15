import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistDto } from '../../api/dtos/artist-dto';
import { SpotifyService } from '../../api/services/spotify.service';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class LineUpComponent implements OnInit {
  artistList$: Observable<ArtistDto[]> = new Observable<ArtistDto[]>();
  artists: ArtistDto[] = [];

  constructor(private service : SpotifyService, private router: Router) { }

  ngOnInit(): void {
    this.artistList$ = this.service.getArtists();
  }
}
