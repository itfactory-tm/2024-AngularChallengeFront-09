import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../../components/error-toast/error-toast.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { GenreService } from '../../../api/services/Genres/genre.service';
import { Observable } from 'rxjs';
import { GenreResponseDto } from '../../../api/dtos/Genre/genre-response-dto';
import { GenreRequestDto } from '../../../api/dtos/Genre/genre-request-dto';

@Component({
  selector: 'app-genre-crud',
  standalone: true,
  imports: [FormsModule, ErrorToastComponent, AsyncPipe, CommonModule],
  templateUrl: './genre-crud.component.html',
  styleUrl: './genre-crud.component.css',
})
export class GenreCrudComponent {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  genres$!: Observable<GenreResponseDto[]>;
  edit = false;
  selectedGenreId = '';
  selectedGenreDto: GenreRequestDto = {
    name: '',
  };

  constructor(private genreService: GenreService) {}

  ngOnInit() {
    this.genreService.fetchGenres();
    this.genres$ = this.genreService.genres$;
  }

  scrollToForm() {
    const offset = 220; // Height of the navbar
    //const targetPosition = this.nextSection.nativeElement.offsetTop - offset;
    const targetPosition = document.getElementById('crudFormTitle');

    if (targetPosition) {
      if (window.outerWidth < 800) {
        window.scrollTo({
          top: targetPosition.offsetTop - offset,
          behavior: 'smooth',
        });
      }
    }
  }

  deleteGenre(id: string) {
    this.genreService
      .deleteGenre(id)
      .subscribe(() => this.genreService.fetchGenres());
  }

  submitEdit() {
    this.genreService
      .updateGenre(this.selectedGenreId, this.selectedGenreDto)
      .subscribe(() => {
        this.genreService.fetchGenres();
      });

    this.disableEdit();
  }

  submitForm() {
    this.genreService.addGenre(this.selectedGenreDto).subscribe(() => {
      this.genreService.fetchGenres();
    });
  }

  enableEdit(stage: GenreResponseDto) {
    this.edit = true;
    this.selectedGenreId = stage.id;
    this.selectedGenreDto = {
      name: stage.name,
    };
    this.scrollToForm();
  }

  disableEdit() {
    this.edit = false;
    this.selectedGenreDto = {
      name: '',
    };
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }
}
