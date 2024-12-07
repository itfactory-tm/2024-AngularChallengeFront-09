import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StageService } from '../../api/services/Stages/stage.service';
import { StageRequestDto } from '../../api/dtos/Stage/stage-request-dto';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';

@Component({
  selector: 'app-stage-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stage-form.component.html',
  styleUrl: './stage-form.component.css',
})
export class StageFormComponent {
  constructor(private stageService: StageService) {}
  @Output() ErrorEvent = new EventEmitter<string>();
  @Output() StageCreatedEvent = new EventEmitter<StageResponseDto>();
  @Input()
  edit = false;
  @Output()
  editChange = new EventEmitter<boolean>();
  @Input()
  selectedStageId = '';
  @Input()
  selectedStageDto: StageRequestDto = {
    name: '',
    description: '',
    capacity: 0,
    longitude: 0,
    latitude: 0,
  };
  submitForm() {
    this.stageService.addStage(this.selectedStageDto).subscribe({
      next: value => {
        this.StageCreatedEvent.emit(value);
        this.stageService.fetchStages();
      },
      error: err => {
        this.ErrorEvent.emit(err.message);
      },
    });
  }

  submitEdit() {
    this.stageService
      .updateStage(this.selectedStageId, this.selectedStageDto)
      .subscribe(() => this.stageService.fetchStages());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.editChange.emit(this.edit);
    this.selectedStageDto = {
      name: '',
      description: '',
      capacity: 0,
      longitude: 0,
      latitude: 0,
    };
  }
}
