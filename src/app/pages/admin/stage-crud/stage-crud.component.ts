import { Component, ViewChild } from '@angular/core';
import { ErrorToastComponent } from '../../../components/error-toast/error-toast.component';
import { Observable } from 'rxjs';
import { StageResponseDto } from '../../../api/dtos/Stage/stage-response-dto';
import { StageRequestDto } from '../../../api/dtos/Stage/stage-request-dto';
import { StageService } from '../../../api/services/Stages/stage.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StageFormComponent } from '../../../components/stage-form/stage-form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-stage-crud',
  standalone: true,
  imports: [
    FormsModule,
    ErrorToastComponent,
    AsyncPipe,
    CommonModule,
    StageFormComponent,
  ],
  templateUrl: './stage-crud.component.html',
  styleUrl: './stage-crud.component.css',
})
export class StageCrudComponent {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  stages$!: Observable<StageResponseDto[]>;
  edit = false;
  backendUrl = environment.backendUrl;
  selectedStageImageUrl = '';
  selectedStageId = '';
  selectedStageDto: StageRequestDto = {
    name: '',
    description: '',
    capacity: 0,
    longitude: 0,
    latitude: 0,
    image: null,
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
    const offset = 220; // Height of the navbar
    //const targetPosition = this.nextSection.nativeElement.offsetTop - offset;
    const targetPosition = document.getElementById('crudFormTitle');

    if (targetPosition) {
      if (window.outerWidth < 800) {
        window.scrollTo({
          top: targetPosition.offsetTop - offset,
          behavior: 'smooth',
        });
      }
    }
  }

  editStage(stage: StageResponseDto) {
    this.edit = true;
    this.selectedStageId = stage.id;
    this.selectedStageImageUrl = `${environment.backendUrl}/${stage.imageUrl}`;
    this.selectedStageDto = {
      name: stage.name,
      description: stage.description,
      capacity: stage.capacity,
      longitude: stage.longitude,
      latitude: stage.latitude,
      image: null,
    };
    this.scrollToForm();
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }
}
