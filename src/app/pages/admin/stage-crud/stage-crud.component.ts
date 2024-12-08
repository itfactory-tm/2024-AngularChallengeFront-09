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
import { HttpClient } from '@angular/common/http';

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
  @ViewChild('sForm') stageForm!: StageFormComponent;
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

  constructor(
    private stageService: StageService,
    private http: HttpClient
  ) {}

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

  downloadImageAsBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  editStage(stage: StageResponseDto) {
    this.edit = true;
    this.selectedStageId = stage.id;
    this.selectedStageImageUrl = `${environment.backendUrl}/${stage.imageUrl}`;

    this.stageForm.clearImageInput();
    // Download the image as a Blob and convert to File
    this.downloadImageAsBlob(this.selectedStageImageUrl).subscribe({
      next: blob => {
        // Convert the Blob to a File object
        const file = new File([blob], 'image.jpg', { type: blob.type });

        // Create the selectedStageDto with the File
        this.selectedStageDto = {
          name: stage.name,
          description: stage.description,
          capacity: stage.capacity,
          longitude: stage.longitude,
          latitude: stage.latitude,
          image: file, // Attach the image here
        };

        // Proceed with form scroll (or any other logic)
        this.scrollToForm();
      },
      error: error => {
        console.error('Error fetching image:', error);
      },
    });
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }
}
