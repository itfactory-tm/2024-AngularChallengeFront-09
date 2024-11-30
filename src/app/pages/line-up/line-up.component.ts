import { Component, OnInit, ViewChild } from '@angular/core';
import { groupBy, map, mergeMap, toArray } from 'rxjs';
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
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';

@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [
    ArtistComponent,
    FormatLineUpTitlePipe,
    RouterModule,
    ErrorToastComponent,
  ],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css',
})
export class LineUpComponent implements OnInit {
  errorMessage = '';
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  artistSchedule?: ArtistResponseDto[];
  activeFilter?: string = 'all';

  subfilters: string[] = [];
  activeSubFilterIndex = 0;

  constructor(
    private artistService: ArtistService,
    private dayService: DayService,
    private genreService: GenreService,
    private stageService: StageService,
    private performanceService: PerformanceService
  ) {}

  ngOnInit(): void {
    this.artistService.getArtists().subscribe({
      next: artists => (this.artistSchedule = artists),
      error: err => {
        console.error(err);
        this.errorMessage = `Error loading artists: ${err.message}`;
        this.errorToast.showToast();
      },
    });
  }

  updateSubFilter(n: number) {
    this.activeSubFilterIndex = n;
    this.updateFilterContent();
  }

  updateFilterContent(filterValue?: string) {
    this.subfilters = [];

    if (filterValue) {
      this.activeFilter = filterValue;
      this.activeSubFilterIndex = 0;
    }

    switch (this.activeFilter) {
      case 'all': {
        this.artistService.getArtists().subscribe({
          next: artists => (this.artistSchedule = artists),
          error: err => {
            console.error(err);
            this.errorMessage = `Error loading artists: ${err.message}`;
            this.errorToast.showToast();
          },
        });
        break;
      }

      case 'byDay': {
        this.dayService.getDays().subscribe(days => {
          this.subfilters = days.map((day: DayResponseDto) => day.date);

          const day = days[this.activeSubFilterIndex];

          this.artistService.getArtistsByDay(day.id).subscribe({
            next: artists => (this.artistSchedule = artists),
            error: err => {
              console.error(err);
              this.errorMessage = `Error loading artists: ${err.message}`;
              this.errorToast.showToast();
            },
          });
        });
        break;
      }

      case 'byGenre': {
        this.genreService.getGenres().subscribe(genres => {
          this.subfilters = genres.map((genre: GenreResponseDto) => genre.name);
          const genre = genres[this.activeSubFilterIndex];
          const activeGenreArtists = this.artistService.getArtistsByGenre(
            genre.id
          );
          activeGenreArtists.subscribe({
            next: artist => (this.artistSchedule = artist),
            error: err => {
              this.errorMessage = err.message;
              this.errorToast.showToast();
            },
          });
        });

        break;
      }

      case 'byStage': {
        this.stageService.getStages().subscribe(stages => {
          this.subfilters = stages.map((stage: StageResponseDto) => stage.name);
          const filter = this.subfilters[this.activeSubFilterIndex];

          this.performanceService
            .getPerformances()
            .pipe(
              mergeMap(performances => performances),
              groupBy(performance => performance.stage.name),
              mergeMap(group$ =>
                group$.pipe(
                  map(performance => performance.artist),
                  toArray(),
                  map(artists => ({ stageName: group$.key, artists }))
                )
              )
            )
            .subscribe(({ stageName, artists }) => {
              if (stageName === filter) {
                this.artistSchedule = artists;
              }
            });
        });

        break;
      }
    }
  }
}
