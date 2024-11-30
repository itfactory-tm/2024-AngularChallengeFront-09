import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../api/dtos/Genre/genre-response-dto';
import { GenreService } from '../../api/services/Genres/genre.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { GenreRequestDto } from '../../api/dtos/Genre/genre-request-dto';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.css',
})
export class ArtistFormComponent implements OnInit {
  constructor(private artistService: ArtistService, private genreService: GenreService) {}
 
  @Output() ErrorEvent = new EventEmitter<string>();
  @Input()
  edit = false;
  @Output()
  editChange = new EventEmitter<boolean>();
  @Input()
  selectedArtistId = '';
  @Input()
  selectedArtistDto: ArtistRequestDto = {
    name: '',
    discogsId: ''
  };

  selectedGenres: string[] = [];
  genres$!: Observable<GenreResponseDto[]>;

  ngOnInit(): void {
    this.genres$ = this.genreService.getGenres();
  }

  submitEdit() {
    this.selectedArtistDto.genres = this.selectedGenres.map(name => ({ name }));

    console.log(this.selectedArtistDto);

    this.artistService
      .updateArtist(this.selectedArtistId, this.selectedArtistDto)
      .subscribe(() => this.artistService.fetchArtists());

    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.selectedGenres = [];
    this.editChange.emit(this.edit);
    this.selectedArtistDto = {
      name: '',
      discogsId: '',
    };
  }

  submitForm() {
    this.selectedArtistDto.genres = this.selectedGenres.map(name => ({ name }));
    this.artistService.addArtist(this.selectedArtistDto).subscribe({
      next: () => {
        this.artistService.fetchArtists();
      },
      error: err => {
        this.ErrorEvent.emit(err.message);
      },
    });
    this.selectedGenres = [];
  }
}
