import { Component, OnInit, ViewChild } from '@angular/core';
import {
  combineLatest,
  forkJoin,
  groupBy,
  map,
  mergeMap,
  of,
  toArray,
} from 'rxjs';
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

  mainGenres: string[] = ['rap', 'pop', 'hip hop'];

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
          const derivedFilters: Map<string, string[]> = new Map<
            string,
            string[]
          >();

          this.mainGenres.forEach(mainGenre => {
            // Zorg ervoor dat bv 'trap' niet gemerged word met 'rap'
            const regex = new RegExp(`\\b(${mainGenre})\\b`, 'i');

            const derivedFiltersForGenre = this.subfilters.filter(
              subfilter =>
                !this.mainGenres.includes(subfilter) && regex.test(subfilter)
            );

            // Enkel de hoofgenres die afgeleide genres hebben worden opgeslagen
            if (derivedFiltersForGenre.length > 0) {
              derivedFilters.set(mainGenre, derivedFiltersForGenre);
            }
          });

          // Pas de subfilter aan zonder de afgeleide genres
          this.subfilters = this.subfilters.filter(
            item => !Array.from(derivedFilters.values()).flat().includes(item)
          );

          // Haal all genres van de subfilters op
          const filteredGenres = genres.filter(genre =>
            this.subfilters.includes(genre.name)
          );

          // Bepaal het actieve genre
          const activeGenre = filteredGenres[this.activeSubFilterIndex];

          const derivedArtistsMap = new Map<string, ArtistResponseDto[]>();

          // Maak een lijst van observables aan die worden uitgevoerd voor elke mainGenre
          const derivedArtistsRequests = Array.from(
            derivedFilters.entries()
          ).map(([mainGenre, derivedFilters]) => {
            const derivedGenreResponseDtos = genres.filter(g =>
              derivedFilters.includes(g.name)
            );

            // Combineer observables voor alle afgeleide genres van dit hoofdgenre
            return combineLatest(
              derivedGenreResponseDtos.map(genre =>
                this.artistService.getArtistsByGenre(genre.id)
              )
            ).pipe(
              map(arrays => arrays.flat()), // Combineer alle artiesten in één lijst
              map(artists => ({ mainGenre, artists })) // Voeg de genre-informatie toe aan de output
            );
          });

          // Gebruik `forkJoin` om te wachten tot alle observables zijn afgerond
          forkJoin(derivedArtistsRequests).subscribe(results => {
            results.forEach(({ mainGenre, artists }) => {
              derivedArtistsMap.set(mainGenre, artists);
            });

            // Neem alle artiesten van het actieve genre
            let activeGenreArtists = this.artistService.getArtistsByGenre(
              activeGenre.id
            );

            if (this.mainGenres.includes(activeGenre.name)) {
              // Voeg alle afgeleide artiesten van het actieve genre samen in één observable
              const derivedArtistsObservable = of(
                derivedArtistsMap.get(activeGenre.name)!
              );

              activeGenreArtists = combineLatest([
                activeGenreArtists,
                derivedArtistsObservable,
              ]).pipe(
                map(([artists1, artists2]) => {
                  const combinedArtists = artists2
                    ? [...artists1, ...artists2]
                    : [...artists1];
                  const uniqueArtists = new Map(
                    combinedArtists.map(artist => [artist.name, artist])
                  );
                  return Array.from(uniqueArtists.values());
                })
              );
            }

            activeGenreArtists.subscribe({
              next: artists => (this.artistSchedule = artists),
              error: err => {
                console.error(err);
                this.errorMessage = `Error loading artists: ${err.message}`;
                this.errorToast.showToast();
              },
            });
          });

          // --- OUDE STUK CODE HOE HET NORMAAL WEKRT ---
          // this.subfilters = genres.map((genre: GenreResponseDto) => genre.name);
          // let genre = genres[this.activeSubFilterIndex]
          // let activeGenreArtists = this.artistService.getArtistsByGenre(genre.id);
          // this.artistSchedule = activeGenreArtists;
          // --- OUDE STUK CODE HOE HET NORMAAL WEKRT ---
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
