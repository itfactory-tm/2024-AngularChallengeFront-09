import { Component, OnInit } from '@angular/core';
import { combineLatest, forkJoin, groupBy, map, merge, mergeMap, Observable, of, toArray } from 'rxjs';
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
  artistSchedule: Observable<ArtistResponseDto[]> = new Observable<ArtistResponseDto[]>();
  activeFilter?: string = "all";

  subfilters: string[] = [];
  activeSubFilterIndex: number = 0;

  mainGenres: string[] = ["rap", "pop", "hip hop"];

  constructor(private artistService : ArtistService, private dayService: DayService,
              private genreService: GenreService,
              private stageService: StageService,
              private performanceService: PerformanceService) { }

  ngOnInit(): void {
    let artists = this.artistService.getArtists();
    this.artistSchedule = artists;
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
      case "all": {
        let artists = this.artistService.getArtists();
        this.artistSchedule = artists;
        break;
      }

      case "byDay": {
        this.dayService.getDays().subscribe(days => {
          this.subfilters = days.map((day: DayResponseDto) => day.date);
          
          let day = days[this.activeSubFilterIndex]
          let artists = this.artistService.getArtistsByDay(day.id);
          this.artistSchedule = artists;
        });
        break;
      }

      case "byGenre": {
        this.genreService.getGenres().subscribe(genres => {
          this.subfilters = genres.map((genre: GenreResponseDto) => genre.name);
          let derivedFilters: Map<string, string[]> = new Map<string, string[]>();

          this.mainGenres.forEach(mainGenre => {
            let derivedFiltersForGenre = this.subfilters.filter(subfilter => 
              !this.mainGenres.includes(subfilter) && (subfilter.includes(mainGenre))
            )

            // Enkel de hoofgenres die afgeleide genres hebben worden opgeslagen
            if (derivedFiltersForGenre.length > 0) {
              derivedFilters.set(mainGenre, derivedFiltersForGenre);
            }
          });

          // Pas de subfilter aan zonder de afgeleide genres
          this.subfilters = this.subfilters.filter(item => !Array.from(derivedFilters.values()).flat().includes(item));

          // Haal all genres van de subfilters op
          let filteredGenres = genres.filter(genre => this.subfilters.includes(genre.name));

          // Bepaal het actieve genre
          let activeGenre = filteredGenres[this.activeSubFilterIndex];
          
          let derivedArtistsMap = new Map<string, ArtistResponseDto[]>();

          // Maak een lijst van observables aan die worden uitgevoerd voor elke mainGenre
          const derivedArtistsRequests = Array.from(derivedFilters.entries()).map(([mainGenre, derivedFilters]) => {
            let derivedGenreResponseDtos = genres.filter(g => derivedFilters.includes(g.name));
          
            // Combineer observables voor alle afgeleide genres van dit hoofdgenre
            return combineLatest(
              derivedGenreResponseDtos.map(genre => this.artistService.getArtistsByGenre(genre.id))
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
            let activeGenreArtists = this.artistService.getArtistsByGenre(activeGenre.id);

            if (this.mainGenres.includes(activeGenre.name)) {
              // Voeg alle afgeleide artiesten van het actieve genre samen in één observable
              const derivedArtistsObservable = of(derivedArtistsMap.get(activeGenre.name)!);
              
              activeGenreArtists = combineLatest([activeGenreArtists, derivedArtistsObservable]).pipe(
                map(([artists1, artists2]) => {
                  const combinedArtists = artists2 ? [...artists1, ...artists2] : [...artists1];
                  const uniqueArtists = new Map(combinedArtists.map(artist => [artist.name, artist]));
                  return Array.from(uniqueArtists.values());
                })
              );
            }

            this.artistSchedule = activeGenreArtists;
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
              this.artistSchedule =  of(artists);
            }
          });
        });

        break;
      }
    }
  }
}
