import { Component, ViewChild } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistFormComponent } from '../../components/artist-form/artist-form.component';
import { convertBiographyToHtml } from '../../lib/utils';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-artist-crud',
  standalone: true,
  imports: [
    FormsModule,
    ErrorToastComponent,
    CommonModule,
    ArtistFormComponent,
	AdminNavComponent,
  ],
  templateUrl: './artist-crud.component.html',
  styleUrl: './artist-crud.component.css',
})
export class ArtistCrudComponent implements OnInit {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  artists!: ArtistResponseDto[];
  artistBios: string[] = [];
  edit = false;
  selectedArtistId = '';
  selectedArtistDto: ArtistRequestDto = {
    name: '',
    discogsId: '',
  };

  constructor(private artistService: ArtistService) {}

  ngOnInit() {
    this.artistService.fetchArtists();
    this.artistService.getArtists().subscribe({
      next: artists => {
        artists.forEach(artist => {
          this.artistBios.push(convertBiographyToHtml(artist.biography));
        });
        this.artists = artists;
        console.log(artists);
      },
      error: err => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      },
    });
  }

  editArtist(artist: ArtistResponseDto) {
    this.edit = true;
    this.selectedArtistId = artist.id;
    this.selectedArtistDto = {
      name: artist.name,
      discogsId: artist.discogsId,
    };
  }

  deleteArtist(id: string) {
    this.artistService
      .deleteArtist(id)
      .subscribe(() => this.artistService.fetchArtists());
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }

  onArtistCreatedEvent() {
    this.artistService.getArtists().subscribe({
      next: artists => (this.artists = artists),
      error: err => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      },
    });
  }
}
