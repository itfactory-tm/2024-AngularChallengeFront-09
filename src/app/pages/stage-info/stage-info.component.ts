import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../api/services/Stages/stage.service';
import { map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { PerformanceResponseDto } from '../../api/dtos/Performance/performance-response-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
@Component({
  selector: 'app-stage-info',
  templateUrl: './stage-info.component.html',
  styleUrls: ['./stage-info.component.css'],
  standalone: true,
  imports: [AsyncPipe]
})
export class StageInfoComponent implements OnInit {
  baseUrl = `${environment.baseUrl}/..`;
  stage$!: Observable<StageResponseDto>;
  performances$!: Observable<PerformanceResponseDto[]>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private sanitizer: DomSanitizer,
    private performanceService : PerformanceService
  ) {}

  ngOnInit() {
    this.stage$ = this.route.params.pipe(
      switchMap(params => this.stageService.getStageBySlug(params['slug']))
    );
    this.performances$ = this.stage$.pipe(
      switchMap(stage => this.performanceService.getPerformancesByStage(stage.id)) // Use `stage.id` safely here
    );
  }
  getSanitizedUrl(latitude: number, longitude: number) {
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
