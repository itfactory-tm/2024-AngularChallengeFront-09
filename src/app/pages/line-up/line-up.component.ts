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
import { DayResponseDto } from '../../api/dtos/Day/day-response-dto';

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

  subfilters: Array<string> = [];
  activeSubFilterIndex: number = 0;

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
        this.subfilters = [];

        let artists = this.artistService.getArtists();
        this.artistSchedule.set("All artists", artists);
        break;
      }

      case "byDay": {
        this.activeSubFilterIndex = 0;
        this.updateDayFilterContent();
        break;
      }

      case "byGenre": {
        this.subfilters = [];

        this.genreService.getGenres().subscribe(genre => {
          genre.forEach(genre => {
            let artists = this.artistService.getArtistsByGenre(genre.id);
            this.artistSchedule.set(genre.name, artists);
          });
        });
      }
    }
  }

  updateSubFilter(n: number) {
    this.activeSubFilterIndex = n;
    this.updateDayFilterContent();
  }

  updateDayFilterContent() {
    this.artistSchedule.clear();

    this.dayService.getDays().subscribe(days => {
      this.subfilters = days.map((day: DayResponseDto) => day.date);
      let day = days[this.activeSubFilterIndex]
      let artists = this.artistService.getArtistsByDay(day.id);
      this.artistSchedule.set(day.date, artists);
    });
  }

}
