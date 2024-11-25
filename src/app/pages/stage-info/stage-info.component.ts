import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../api/services/Stages/stage.service';
import { StageDto } from '../../api/dtos/stage-dto';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-stage-info',
  templateUrl: './stage-info.component.html',
  styleUrls: ['./stage-info.component.css'],
  standalone: true,
  imports: [AsyncPipe]
})
export class StageInfoComponent implements OnInit {
  stage$!: Observable<StageDto | undefined>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService
  ) {}

  ngOnInit() {
    this.stage$ = this.route.params.pipe(
      switchMap(params => this.stageService.getStageBySlug(params['slug']))
    );
  }
}
