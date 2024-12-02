import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../api/services/Stages/stage.service';
import { map, Observable, switchMap,forkJoin } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { PerformanceResponseDto } from '../../api/dtos/Performance/performance-response-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
import { DayResponseDto } from '../../api/dtos/Day/day-response-dto';
import { DayService } from '../../api/services/Day/day.service';
import { PerformanceCardComponent } from '../../components/performance-card/performance-card.component';
@Component({
  selector: 'app-stage-info',
  templateUrl: './stage-info.component.html',
  styleUrls: ['./stage-info.component.css'],
  standalone: true,
  imports: [AsyncPipe, CommonModule, PerformanceCardComponent]
})
export class StageInfoComponent implements OnInit {
  baseUrl = `${environment.baseUrl}/..`;
  stage$!: Observable<StageResponseDto>;
  performances$!: Observable<{ day: DayResponseDto; performances: PerformanceResponseDto[] }[]>;
  days$!: Observable<DayResponseDto[]>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private sanitizer: DomSanitizer,
    private performanceService : PerformanceService,
    private dayService : DayService
  ) {}

  ngOnInit() {
    this.stage$ = this.route.params.pipe(
      switchMap(params => this.stageService.getStageBySlug(params['slug']))
    );
    this.days$ = this.dayService.getDays();

    this.performances$ = this.days$.pipe(
      switchMap(days => 
        this.stage$.pipe(
          switchMap(stage => 
            // Map through each day to fetch performances for the stage and day
            forkJoin(
              days.map(day =>
                this.performanceService.getPerformancesByStageAndDay(stage.id, day.id).pipe(
                  map(performances => ({ day, performances })) // Pair day with its performances
                )
              )
            )
          )
        )
      ),
      map(results => results.flat()) // Flatten the array if needed
    );
    this.performances$.subscribe(data => console.log(data));

    
  }
  getSanitizedUrl(latitude: number, longitude: number) {
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
