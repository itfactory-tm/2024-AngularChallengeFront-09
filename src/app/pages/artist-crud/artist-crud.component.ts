import { Component, ViewChild } from '@angular/core';
import { ArtistRequestDto } from '../../api/dtos/Artist/artist-request-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-artist-crud',
  standalone: true,
  imports: [FormsModule, ErrorToastComponent],
  templateUrl: './artist-crud.component.html',
  styleUrl: './artist-crud.component.css'
})
export class ArtistCrudComponent {
  constructor(private route: Router, private artistService: ArtistService) {}
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage: string = "";

  newArtist: ArtistRequestDto = {
    name: '',
    spotifyId: '',
    biography: ''
  }

  submitForm() {
    this.artistService.addArtist(this.newArtist).subscribe({
      next: () => {
        this.route.navigate(['line-up']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      }
    });
  }
}
