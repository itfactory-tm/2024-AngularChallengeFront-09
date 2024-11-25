import { Component, EventEmitter, ViewChild } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Observable } from 'rxjs';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-artist-crud',
  standalone: true,
  imports: [FormsModule, ErrorToastComponent, AsyncPipe],
  templateUrl: './artist-crud.component.html',
  styleUrl: './artist-crud.component.css'
})
export class ArtistCrudComponent implements OnInit {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage: string = "";
  artists$!: Observable<ArtistResponseDto[]>;
  
  edit: boolean = false;
  newArtist: ArtistRequestDto = {
    id: '',
    name: '',
    spotifyId: '',
    biography: ''
  }

  constructor(private artistService: ArtistService) {}

  ngOnInit() {
    this.artistService.fetchArtists();
    this.artists$ = this.artistService.artists$;
  }

  deleteArtist(id: string) {
    this.artistService.deleteArtist(id)
      .subscribe(() => this.artistService.fetchArtists());
  }

  submitEdit() {
    this.artistService.editArtist(this.newArtist)
      .subscribe(() => this.artistService.fetchArtists());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.newArtist = {
      id: '',
      name: '',
      spotifyId: '',
      biography: ''
    }
  }

  editArtist(artist: ArtistResponseDto) {
    this.edit = true;
    this.newArtist = {
      id: artist.id,
      name: artist.name,
      spotifyId: artist.spotifyId,
      biography: artist.biography
    }
  }

  submitForm() {
    this.artistService.addArtist(this.newArtist).subscribe({
      next: () => {
        this.artistService.fetchArtists();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      }
    });
  }
}
