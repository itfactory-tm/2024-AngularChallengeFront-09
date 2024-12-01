import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../api/dtos/Genre/genre-response-dto';
import { GenreService } from '../../api/services/Genres/genre.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [FormsModule, CommonModule, AsyncPipe, ReactiveFormsModule],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.css',
})
export class ArtistFormComponent implements OnInit {
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
    genres: [],
    discogsId: ''
  };

  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef>;
  selectedGenres: string[] = [];
  genres$!: Observable<GenreResponseDto[]>;

  constructor(private artistService: ArtistService, private genreService: GenreService) {}

  ngOnInit(): void {
    this.genres$ = this.genreService.getGenres();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['edit'] && changes['edit'].currentValue === true) {
      this.selectedGenres = this.selectedArtistDto.genres.map(g => g.name);
      this.resetAllCheckboxes();
    }
  }

  resetAllCheckboxes() {
    for (let checkbox of this.checkboxes) {
      checkbox.nativeElement.checked = false;
    }
  }

  onCheckboxChange(event: any): void {
    const genre = event.target.value;

    if (event.target.checked) {
      this.selectedGenres.push(genre);

    } else {
      this.selectedGenres = this.selectedGenres.filter(
        (g) => g !== genre
      );
    }
  }

  isGenreSelected(genreName: string): boolean {
    return this.selectedArtistDto.genres.some(g => g.name === genreName);
  }
  
  submitEdit() {
    this.selectedArtistDto.genres = this.selectedGenres.map(name => ({ name }));
    this.resetAllCheckboxes();
    this.artistService
      .updateArtist(this.selectedArtistId, this.selectedArtistDto)
      .subscribe(() => this.artistService.fetchArtists());

    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.editChange.emit(this.edit);
    this.selectedGenres = [];
    this.selectedArtistDto = {
      name: '',
      genres: [],
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
  }
}
