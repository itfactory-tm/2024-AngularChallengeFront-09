import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('imageUpload', { static: false }) imageUploadEl!: ElementRef;
  @Output() ErrorEvent = new EventEmitter<string>();
  @Output() StageCreatedEvent = new EventEmitter<StageResponseDto>();
  @Input()
  edit = false;
  @Output()
  editChange = new EventEmitter<boolean>();
  @Input()
  selectedStageImageUrl = '';
  @Input()
  selectedStageId = '';
  @Input()
  selectedStageDto: StageRequestDto = {
    name: '',
    description: '',
    capacity: 0,
    longitude: 0,
    latitude: 0,
    image: null,
  };
  fileData: FormData = new FormData();
  submitForm() {
    console.log('adding', this.selectedStageDto);
    this.stageService.addStage(this.selectedStageDto).subscribe({
      next: value => {
        this.StageCreatedEvent.emit(value);
        this.stageService.fetchStages();
      },
      error: err => {
        this.ErrorEvent.emit(err.message);
      },
    });
    this.selectedStageImageUrl = '';
    this.cancelEdit();
  }

  submitEdit() {
    this.stageService
      .updateStage(this.selectedStageId, this.selectedStageDto)
      .subscribe(() => this.stageService.fetchStages());
    this.cancelEdit();
  }

  clearImageInput() {
    this.imageUploadEl.nativeElement.value = '';
  }

  cancelEdit() {
    this.edit = false;
    this.editChange.emit(this.edit);
    this.selectedStageImageUrl = '';
    this.selectedStageDto = {
      name: '',
      description: '',
      capacity: 0,
      longitude: 0,
      latitude: 0,
      image: null,
    };
    this.clearImageInput();
  }
  fileChange(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length < 1) {
      return;
    }

    const file: File = fileList[0];
    if (file) {
      const reader = new FileReader();

      // Event handler for when the file is read
      reader.onload = () => {
        this.selectedStageImageUrl = reader.result!.toString(); // Set the result (base64 data URL) to the imageUrl
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    }

    this.selectedStageDto.image = file; // Assign the selected file to the DTO
  }
}
