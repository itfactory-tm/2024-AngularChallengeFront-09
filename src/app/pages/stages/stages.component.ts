import { Component, OnInit } from '@angular/core';
import { StageService } from '../../api/services/Stages/stage.service';
import { StageDto } from '../../api/dtos/stage-dto';
import { StageComponent } from "../../components/stage/stage.component";
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import slug from 'slug';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'],
  imports: [StageComponent, RouterModule, AsyncPipe],
  standalone: true
})
export class StagesComponent implements OnInit {
  stageList$!: Observable<StageDto[]>;

  constructor(private stageService: StageService) {
    slug.defaults.mode = 'pretty';
  }

  ngOnInit(): void {
    this.stageList$ = this.stageService.getStages();
  }

  generateSlug(stageName: string): string {
    return slug(stageName);
  }
}