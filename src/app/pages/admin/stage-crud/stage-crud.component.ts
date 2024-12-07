import { Component, ViewChild } from '@angular/core';
import { ErrorToastComponent } from '../../../components/error-toast/error-toast.component';
import { Observable } from 'rxjs';
import { StageResponseDto } from '../../../api/dtos/Stage/stage-response-dto';
import { StageRequestDto } from '../../../api/dtos/Stage/stage-request-dto';
import { StageService } from '../../../api/services/Stages/stage.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StageFormComponent } from '../../../components/stage-form/stage-form.component';

@Component({
  selector: 'app-stage-crud',
  standalone: true,
  imports: [
    FormsModule,
    ErrorToastComponent,
    AsyncPipe,
    CommonModule,
    StageFormComponent
],
  templateUrl: './stage-crud.component.html',
  styleUrl: './stage-crud.component.css',
})
export class StageCrudComponent {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  stages$!: Observable<StageResponseDto[]>;
  edit = false;
  selectedStageId = '';
  selectedStageDto: StageRequestDto = {
    name: '',
    description: '',
    capacity: 0,
    longitude: 0,
    latitude: 0,
  };

  constructor(private stageService: StageService) {}

  ngOnInit() {
    this.stageService.fetchStages();
    this.stages$ = this.stageService.stages$;
  }

  deleteStage(id: string) {
    this.stageService
      .deleteStage(id)
      .subscribe(() => this.stageService.fetchStages());
  }

  scrollToForm() {
    const offset = 160; // Height of the navbar
    //const targetPosition = this.nextSection.nativeElement.offsetTop - offset;
    const targetPosition = document.getElementById('crudFormTitle');

    if (targetPosition) {
      window.scrollTo({
        top: targetPosition.offsetTop - offset,
        behavior: 'smooth',
      });
    }
  }

  editStage(stage: StageResponseDto) {
    this.edit = true;
    this.selectedStageId = stage.id;
    this.selectedStageDto = {
      name: stage.name,
      description: stage.description,
      capacity: stage.capacity,
      longitude: stage.longitude,
      latitude: stage.latitude,
    };
    this.scrollToForm();
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }
}
