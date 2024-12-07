import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ArtistRequestDto } from '../../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../../components/error-toast/error-toast.component';
import { ArtistResponseDto } from '../../../api/dtos/Artist/artist-response-dto';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistFormComponent } from '../../../components/artist-form/artist-form.component';
import { convertBiographyToHtml } from '../../../lib/utils';
import { map, Observable } from 'rxjs';
import { GenreResponseDto } from '../../../api/dtos/Genre/genre-response-dto';

@Component({
  selector: 'app-artist-crud',
  standalone: true,
  imports: [
    FormsModule,
    ErrorToastComponent,
    CommonModule,
    ArtistFormComponent,
  ],
  templateUrl: './artist-crud.component.html',
  styleUrl: './artist-crud.component.css',
})
export class ArtistCrudComponent implements OnInit {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  artists$!: Observable<ArtistResponseDto[]>;
  edit = false;
  selectedArtistId = '';
  selectedArtistDto: ArtistRequestDto = {
    name: '',
    genres: [],
    discogsId: '',
  };

  constructor(
    private artistService: ArtistService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.artistService.fetchArtists();

    this.artists$ = this.artistService.artists$.pipe(
      map(artists =>
        artists.map(artist => ({
          ...artist,
          biography: convertBiographyToHtml(artist.biography),
          showFullBio: false,
        }))
      )
    );
  }

  getGenreList(genres: GenreResponseDto[]): string {
    return '(' + genres.map(genre => genre.name).join(', ') + ')';
  }

  toggleBiography(artist: ArtistResponseDto) {
    artist.showFullBio = !artist.showFullBio;
  }
  editArtist(artist: ArtistResponseDto) {
    this.edit = true;
    this.selectedArtistId = artist.id;
    this.scrollToForm();
    this.selectedArtistDto = {
      name: artist.name,
      genres: artist.genres,
      discogsId: artist.discogsId,
    };
  }

  scrollToForm() {
    const offset = 160; // Height of the navbar
    //const targetPosition = this.nextSection.nativeElement.offsetTop - offset;
    const targetPosition = document.getElementById('crudFormTitle');

    if (targetPosition) {
      window.scrollTo({
        top: targetPosition.offsetTop - offset,
        behavior: 'smooth',
      });
    }
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
}
