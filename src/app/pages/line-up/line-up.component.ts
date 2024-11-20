import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from '../../components/artist/artist.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { DayService } from '../../api/services/Day/day.service';
import { FormatDatePipe } from '../../pipes/format-date.pipe';


@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [ArtistComponent, AsyncPipe, FormatDatePipe, RouterModule],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class  LineUpComponent implements OnInit {
  // artistList!: ArtistResponseDto[];
  artistList$!: Observable<ArtistResponseDto[]>;
  artistSchedule: Map<string, Observable<ArtistResponseDto[]>> = new Map();

  constructor(private artistService : ArtistService, private dayService: DayService) { }

  ngOnInit(): void {
    this.artistList$ = this.artistService.getArtists();

    this.dayService.getDays().subscribe(days => {
      days.forEach(day => {
        let artists = this.artistService.getArtistsByDay(day.id);
        this.artistSchedule.set(day.date, artists);
      });
    });
  }
}
