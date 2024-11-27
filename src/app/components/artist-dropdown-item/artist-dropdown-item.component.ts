import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-artist-dropdown-item',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './artist-dropdown-item.component.html',
  styleUrl: './artist-dropdown-item.component.css',
})
export class ArtistDropdownItemComponent {
  @Input()
  selectedArtist?: ArtistResponseDto;
  @Output()
  selectedArtistChange = new EventEmitter<ArtistResponseDto>();
}
