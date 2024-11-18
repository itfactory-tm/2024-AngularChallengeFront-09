import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtisResponsetDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';

@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, FormsModule],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class LineUpComponent implements OnInit {
  artistList$: Observable<ArtisResponsetDto[]> = new Observable<ArtisResponsetDto[]>();
  newArtist: ArtistRequestDto = {
    name: "",
    biography: "",
    spotifyId: ""
  }

  constructor(private service : ArtistService, private router: Router) { }

  ngOnInit(): void {
    this.artistList$ = this.service.getArtists();
  }

  submitForm() {
    this.service.addArtist(this.newArtist).subscribe({
      next: () => this.router.navigate([""]),
      error: (error: Error) => alert(error.message)
    });
  }
}
