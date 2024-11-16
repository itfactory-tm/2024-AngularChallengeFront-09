import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtisResponsetDto } from '../../api/dtos/artist-response-dto';
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
  artistList$: Observable<ArtisResponsetDto[]> = new Observable<ArtisResponsetDto[]>();

  constructor(private service : SpotifyService, private router: Router) { }

  ngOnInit(): void {
    this.artistList$ = this.service.getArtists();
  }
}
