import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../api/services/Stages/stage.service';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stage-info',
  templateUrl: './stage-info.component.html',
  styleUrls: ['./stage-info.component.css'],
  standalone: true,
  imports: [AsyncPipe]
})
export class StageInfoComponent implements OnInit {
  baseUrl = `${environment.baseUrl}/..`;
  stage$!: Observable<StageResponseDto | undefined>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.stage$ = this.route.params.pipe(
      switchMap(params => this.stageService.getStageBySlug(params['slug']))
    );
  }
  getSanitizedUrl(latitude: number, longitude: number) {
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
