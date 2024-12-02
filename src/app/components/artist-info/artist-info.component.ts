import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
import { Observable } from 'rxjs';
import { convertBiographyToHtml } from '../../lib/utils';

@Component({
  selector: 'app-artist-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css'],
})
export class ArtistInfoComponent {
  @Input() artist!: ArtistResponseDto;
  @Output() closeModal = new EventEmitter<void>();
  performances$: Observable<any> | null = null; // Initialize as null or undefined
  htmlBiography = '';

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    // Fetch performances when the component initializes
    this.performances$ = this.performanceService.getPerformancesByArtist(
      this.artist.id
    );
    this.htmlBiography = convertBiographyToHtml(this.artist.biography);
  }
  close(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
