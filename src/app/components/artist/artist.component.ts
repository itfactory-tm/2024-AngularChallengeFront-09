import { Component,Input } from '@angular/core';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent {
 @Input()
 artist!: ArtistResponseDto;
}
