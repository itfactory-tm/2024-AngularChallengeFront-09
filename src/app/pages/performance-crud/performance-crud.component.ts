import { Component, ViewChild } from '@angular/core';
import { PerformanceRequestDto } from '../../api/dtos/Performance/performance-request-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Observable } from 'rxjs';
import { PerformanceResponseDto } from '../../api/dtos/Performance/performance-response-dto';
import { OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { DayResponseDto } from '../../api/dtos/Day/day-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { DayService } from '../../api/services/Day/day.service';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { StageService } from '../../api/services/Stages/stage.service';
import { ArtistDropdownComponent } from '../../components/artist-dropdown/artist-dropdown.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';

@Component({
  selector: 'app-performance-crud',
  standalone: true,
  imports: [
    FormsModule,
    ErrorToastComponent,
    AsyncPipe,
    CommonModule,
    ArtistDropdownComponent,
    DatePipe,
  ],
  templateUrl: './performance-crud.component.html',
  styleUrl: './performance-crud.component.css',
})
export class PerformanceCrudComponent implements OnInit {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  performances$!: Observable<PerformanceResponseDto[]>;
  edit = false;
  createNewDate = false;
  selectedPerformanceId = '';
  selectedPerformanceDto: PerformanceRequestDto = {
    artistId: '',
    dayId: '',
    stageId: '',
  };
  selectedArtist?: ArtistResponseDto;
  days$!: Observable<DayResponseDto[]>;
  stages$!: Observable<StageResponseDto[]>;

  constructor(
    private performanceService: PerformanceService,
    private artistService: ArtistService,
    private dayService: DayService,
    private stageService: StageService
  ) {}

  ngOnInit() {
    this.performances$ = this.performanceService.getPerformances();
    this.days$ = this.dayService.getDays();
    this.stages$ = this.stageService.getStages();
  }

  resetForm() {
    this.edit = false;
    this.selectedArtist = undefined;
    this.createNewDate = false;
    this.selectedPerformanceId = '';
    this.selectedPerformanceDto = {
      artistId: '',
      dayId: '',
      stageId: '',
    };
  }

  refreshPerformances() {
    this.performances$ = this.performanceService.getPerformances();
  }

  deletePerformance(id: string) {
    this.performanceService
      .deletePerformance(id)
      .subscribe(() => this.refreshPerformances());
  }

  submitEdit() {
    this.performanceService
      .editPerformance(this.selectedPerformanceId, this.selectedPerformanceDto)
      .subscribe(() => this.refreshPerformances());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.selectedPerformanceDto = {
      artistId: '',
      dayId: '',
      stageId: '',
    };
  }

  editPerformance(performance: PerformanceResponseDto) {
    this.edit = true;
    this.selectedPerformanceId = performance.id;
    this.selectedPerformanceDto = {
      artistId: performance.artist.id,
      dayId: performance.day.id,
      stageId: performance.stage.id,
    };

    this.artistService
      .getArtistById(this.selectedPerformanceDto.artistId)
      .subscribe({
        next: artist => (this.selectedArtist = artist),
        error: err => console.error('ERROR GETTING ARTIST BY ID', err),
      });
  }

  submitForm() {
    this.performanceService
      .addPerformance(this.selectedPerformanceDto)
      .subscribe({
        next: () => {
          this.refreshPerformances();
        },
        error: err => {
          this.errorMessage = err.message;
          this.errorToast.showToast();
        },
      });
    this.resetForm();
  }

  onArtistSelected(artist: any) {
    this.selectedPerformanceDto.artistId = artist.id;
    this.artistService
      .getArtistById(this.selectedPerformanceDto.artistId)
      .subscribe(artist => (this.selectedArtist = artist));
  }
}
