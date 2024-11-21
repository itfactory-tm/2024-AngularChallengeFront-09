import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from '../../components/artist/artist.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { DayService } from '../../api/services/Day/day.service';
import { FormatLineUpTitlePipe } from '../../pipes/format-line-up-title.pipe';
import { GenreService } from '../../api/services/Genres/genre.service';

@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [ArtistComponent, AsyncPipe, FormatLineUpTitlePipe, RouterModule],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class  LineUpComponent implements OnInit {
  artistSchedule: Map<string, Observable<ArtistResponseDto[]>> = new Map();
  activeFilter: string = "all";

  constructor(private artistService : ArtistService, private dayService: DayService,
              private genreService: GenreService) { }

  ngOnInit(): void {
    let artists = this.artistService.getArtists();
    this.artistSchedule.set("All artists", artists);
  }

  filterArtists(value: any): void {
    this.activeFilter = value;
    this.artistSchedule.clear();
    
    switch(value) {
      case "all": {
        let artists = this.artistService.getArtists();
        this.artistSchedule.set("All artists", artists);
        break;
      }

      case "byDay": {
        this.dayService.getDays().subscribe(days => {
          days.forEach(day => {
            let artists = this.artistService.getArtistsByDay(day.id);
            this.artistSchedule.set(day.date, artists);
          });
        });
        break;
      }

      case "byGenre": {
        this.genreService.getGenres().subscribe(genre => {
          genre.forEach(genre => {
            let artists = this.artistService.getArtistsByGenre(genre.id);
            this.artistSchedule.set(genre.name, artists);
          });
        });
      }
    }
  }
}
