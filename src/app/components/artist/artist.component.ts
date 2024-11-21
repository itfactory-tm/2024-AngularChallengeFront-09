import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistInfoComponent } from '../artist-info/artist-info.component';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, ArtistInfoComponent],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent {
  @Input() artist!: ArtistResponseDto;
  isModalOpen = false;

  showArtistInfo(): void {
    this.isModalOpen = true;
  }

  closeArtistInfo(): void {
    this.isModalOpen = false;
  }
}