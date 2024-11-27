import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { OnInit } from '@angular/core';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { AsyncPipe } from '@angular/common';
import { ArtistDropdownItemComponent } from '../artist-dropdown-item/artist-dropdown-item.component';

@Component({
  selector: 'app-artist-dropdown',
  standalone: true,
  imports: [AsyncPipe, ArtistDropdownItemComponent],
  templateUrl: './artist-dropdown.component.html',
  styleUrl: './artist-dropdown.component.css',
})
export class ArtistDropdownComponent implements OnInit {
  isDropdownVisible = false;
  artists!: ArtistResponseDto[];
  @Input()
  selectedArtist?: ArtistResponseDto;
  @Output()
  selectedArtistChange = new EventEmitter<ArtistResponseDto>();
  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getArtists().subscribe(val => (this.artists = val));
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  closeDropdown() {
    this.isDropdownVisible = false;
  }

  selectArtist(artist: ArtistResponseDto) {
    this.selectedArtist = artist;
    this.selectedArtistChange.emit(this.selectedArtist);
    this.toggleDropdown();
  }
}
