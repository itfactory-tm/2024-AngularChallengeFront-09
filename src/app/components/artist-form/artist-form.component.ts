import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.css',
})
export class ArtistFormComponent {
  constructor(private artistService: ArtistService) {}
  @Output() ErrorEvent = new EventEmitter<string>();
  @Output() ArtistCreatedEvent = new EventEmitter<ArtistResponseDto>();
  @Input()
  edit = false;
  @Output()
  editChange = new EventEmitter<boolean>();
  @Input()
  selectedArtistId = '';
  @Input()
  selectedArtistDto: ArtistRequestDto = {
    name: '',
    discogsId: '',
  };

  submitEdit() {
    this.artistService
      .updateArtist(this.selectedArtistId, this.selectedArtistDto)
      .subscribe(() => this.artistService.fetchArtists());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.editChange.emit(this.edit);
    this.selectedArtistDto = {
      name: '',
      discogsId: '',
    };
  }

  submitForm() {
    this.artistService.addArtist(this.selectedArtistDto).subscribe({
      next: value => {
        this.ArtistCreatedEvent.emit(value);
        this.artistService.fetchArtists();
      },
      error: err => {
        this.ErrorEvent.emit(err.message);
      },
    });
  }
}
