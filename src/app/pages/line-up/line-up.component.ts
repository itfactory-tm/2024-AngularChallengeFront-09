import { Component, OnInit } from '@angular/core';
import { groupBy, map, mergeMap, Observable, of, toArray } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from '../../components/artist/artist.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { DayService } from '../../api/services/Day/day.service';
import { FormatLineUpTitlePipe } from '../../pipes/format-line-up-title.pipe';
import { GenreService } from '../../api/services/Genres/genre.service';
import { DayResponseDto } from '../../api/dtos/Day/day-response-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
import { GenreResponseDto } from '../../api/dtos/Genre/genre-response-dto';
import { StageService } from '../../api/services/Stages/stage.service';
import { StageDto } from '../../api/dtos/stage-dto';

@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [ArtistComponent, AsyncPipe, FormatLineUpTitlePipe, RouterModule],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class  LineUpComponent implements OnInit {
  artistSchedule: Map<string, Observable<ArtistResponseDto[]>> = new Map();
  activeFilter?: string = "all";

  subfilters: string[] = [];
  activeSubFilterIndex: number = 0;

  constructor(private artistService : ArtistService, private dayService: DayService,
              private genreService: GenreService,
              private stageService: StageService,
              private performanceService: PerformanceService) { }

  ngOnInit(): void {
    let artists = this.artistService.getArtists();
    this.artistSchedule.set("All artists", artists);
  }

  updateSubFilter(n: number) {
    this.activeSubFilterIndex = n;
    this.updateFilterContent();
  }

  updateFilterContent(filterValue?: string) {
    this.artistSchedule.clear();
    this.subfilters = [];

    if (filterValue) {
      this.activeFilter = filterValue;
      this.activeSubFilterIndex = 0;
    }

    switch (this.activeFilter) {
      case "all": {
        let artists = this.artistService.getArtists();
        this.artistSchedule.set("All artists", artists);
        break;
      }

      case "byDay": {
        this.dayService.getDays().subscribe(days => {
          this.subfilters = days.map((day: DayResponseDto) => day.date);
          
          let day = days[this.activeSubFilterIndex]
          let artists = this.artistService.getArtistsByDay(day.id);
          this.artistSchedule.set(day.date, artists);
        });
        break;
      }

      case "byGenre": {
        this.genreService.getGenres().subscribe(genres => {
          this.subfilters = genres.map((genre: GenreResponseDto) => genre.name);

          let genre = genres[this.activeSubFilterIndex];
          let artists = this.artistService.getArtistsByGenre(genre.id);
          this.artistSchedule.set(genre.name, artists);
        });

        break;
      }

      case "byStage": {
        this.stageService.getStages().subscribe(stages => {
          this.subfilters = stages.map((stage: StageDto) => stage.name);
          let filter = this.subfilters[this.activeSubFilterIndex];

          this.performanceService.getPerformances().pipe(
          mergeMap((performances) => performances),
          groupBy((performance) => performance.stage.name),
          mergeMap((group$) =>
            group$.pipe(
              map((performance) => performance.artist),
              toArray(),
              map((artists) => ({ stageName: group$.key, artists }))
            ))
          )
          .subscribe(({ stageName, artists }) => {
            if (stageName === filter) {
              this.artistSchedule.set(stageName, of(artists));
            }
          });
        });

        break;
      }
    }
  }
}
