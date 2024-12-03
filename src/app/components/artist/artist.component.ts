import { Component, Input, Renderer2 } from '@angular/core';
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
  
  constructor(private renderer: Renderer2) {}

  showArtistInfo(): void {
    this.isModalOpen = true;
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  closeArtistInfo(): void {
    this.isModalOpen = false;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}