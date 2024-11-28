import { Component, ViewChild } from '@angular/core';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Observable } from 'rxjs';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { StageRequestDto } from '../../api/dtos/Stage/stage-request-dto';
import { StageService } from '../../api/services/Stages/stage.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stage-crud',
  standalone: true,
  imports: [FormsModule, ErrorToastComponent, AsyncPipe, CommonModule],
  templateUrl: './stage-crud.component.html',
  styleUrl: './stage-crud.component.css'
})
export class StageCrudComponent {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = "";
  stages$!: Observable<StageResponseDto[]>;
  edit = false;
  selectedStageId = "";
  selectedStageDto: StageRequestDto = {
    name: '',
    description: '',
    capacity: 0,
    longitude:0,
    latitude:0
  }

  constructor(private stageService: StageService) {}

  ngOnInit() {
    this.stageService.fetchStages();
    this.stages$ = this.stageService.stages$;
  }

  deleteStage(id: string) {
    this.stageService.deleteStage(id)
      .subscribe(() => this.stageService.fetchStages());
  }

  submitEdit() {
    this.stageService.updateStage(this.selectedStageId, this.selectedStageDto)
      .subscribe(() => this.stageService.fetchStages());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.selectedStageDto = {
      name: '',
      description: '',
      capacity: 0,
      longitude:0,
      latitude:0
    }
  }

  editStage(stage: StageResponseDto) {
    this.edit = true;
    this.selectedStageId = stage.id;
    this.selectedStageDto = {
      name: stage.name,
      description: stage.description,
      capacity: stage.capacity,
      longitude:stage.longitude,
      latitude:stage.latitude
    }
  }

  submitForm() {
    this.stageService.addStage(this.selectedStageDto).subscribe({
      next: () => {
        this.stageService.fetchStages();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      }
    });
  }
}
