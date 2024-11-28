import { Component, ViewChild } from '@angular/core';
import { PerformanceRequestDto } from '../../api/dtos/Performance/performance-request-dto';
import { PerformanceService } from '../../api/services/Performance/performance.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';
import { Observable, switchMap } from 'rxjs';
import { PerformanceResponseDto } from '../../api/dtos/Performance/performance-response-dto';
import { OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { DayResponseDto } from '../../api/dtos/Day/day-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';
import { DayService } from '../../api/services/Day/day.service';
import { StageService } from '../../api/services/Stages/stage.service';
import { ArtistDropdownComponent } from '../../components/artist-dropdown/artist-dropdown.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { RouterLink } from '@angular/router';
import { ArtistFormComponent } from '../../components/artist-form/artist-form.component';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { StageFormComponent } from '../../components/stage-form/stage-form.component';
import { DayRequestDto } from '../../api/dtos/Day/day-request-dto';

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
    RouterLink,
    ArtistFormComponent,
    StageFormComponent,
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
  newDate = '';
  newDayId = '';
  createNewArtist = false;
  createNewStage = true;
  selectedPerformanceId = '';
  formattedStartTime = '00:00';
  formattedEndTime = '00:00';
  selectedPerformanceDto: PerformanceRequestDto = {
    artistId: '',
    dayId: '',
    stageId: '',
    startTime: new Date(),
    endTime: new Date(),
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
    this.newDayId = '';
    this.newDate = '';
    this.formattedStartTime = '';
    this.formattedEndTime = '';
    this.selectedPerformanceDto = {
      artistId: '',
      dayId: '',
      stageId: '',
      startTime: new Date(),
      endTime: new Date(),
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
    const [startHours, startMinutes] = this.formattedStartTime
      .split(':')
      .map(Number);
    const [endHours, endMinutes] = this.formattedEndTime.split(':').map(Number);
    const now = new Date();

    // Set startTime and endTime for the performance
    this.selectedPerformanceDto.startTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(), // Fix here: use getUTCDate() for day, not getUTCDay()
        startHours,
        startMinutes
      )
    );
    this.selectedPerformanceDto.endTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        endHours,
        endMinutes
      )
    );

    let dayObservable;

    if (this.createNewDate && this.newDate) {
      // Create a new day DTO
      const newDateDto: DayRequestDto = {
        date: new Date(this.newDate).toISOString().split('T')[0], // Get only the date part
        isActive: true,
      };

      // Observable to handle adding the new day
      dayObservable = this.dayService.addDay(newDateDto).pipe(
        switchMap(day => {
          this.newDayId = day.id;

          // Assign the new day ID to the performance DTO
          this.selectedPerformanceDto.dayId = this.newDayId;

          // Return the edit performance observable
          return this.performanceService.editPerformance(
            this.selectedPerformanceId,
            this.selectedPerformanceDto
          );
        })
      );
    } else {
      // If no new day is created, directly edit the performance
      dayObservable = this.performanceService.editPerformance(
        this.selectedPerformanceId,
        this.selectedPerformanceDto
      );
    }

    // Subscribe to the final observable
    dayObservable.subscribe({
      next: () => {
        console.log('PERFORMANCE UPDATED');
        this.refreshPerformances();
      },
      error: err => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      },
      complete: () => {
        this.cancelEdit();
      },
    });
  }

  cancelEdit() {
    this.edit = false;
    this.resetForm();
  }

  toTimeString(date: Date): string {
    if (!(date instanceof Date)) {
      console.log(date);
      throw new Error('Invalid date object');
    }
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  editPerformance(performance: PerformanceResponseDto) {
    this.edit = true;
    this.selectedPerformanceId = performance.id;
    this.selectedPerformanceDto = {
      artistId: performance.artist.id,
      dayId: performance.day.id,
      stageId: performance.stage.id,
      startTime: new Date(performance.startTime),
      endTime: new Date(performance.endTime),
    };

    this.formattedStartTime = this.toTimeString(
      this.selectedPerformanceDto.startTime
    );
    this.formattedEndTime = this.toTimeString(
      this.selectedPerformanceDto.endTime
    );
    console.log(this.formattedStartTime, this.formattedEndTime);
    this.artistService
      .getArtistById(this.selectedPerformanceDto.artistId)
      .subscribe({
        next: artist => (this.selectedArtist = artist),
        error: err => console.error('ERROR GETTING ARTIST BY ID', err),
      });
  }

  submitPerformanceForm() {
    console.log('submitting form');
    const [startHours, startMinutes] = this.formattedStartTime
      .split(':')
      .map(Number);
    const [endHours, endMinutes] = this.formattedEndTime.split(':').map(Number);
    const now = new Date();

    // Set startTime and endTime for the performance
    this.selectedPerformanceDto.startTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(), // Fix here: use getUTCDate() for day, not getUTCDay()
        startHours,
        startMinutes
      )
    );
    this.selectedPerformanceDto.endTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        endHours,
        endMinutes
      )
    );

    let dayObservable;

    if (this.createNewDate && this.newDate) {
      // Create a new day DTO
      const newDateDto: DayRequestDto = {
        date: new Date(this.newDate).toISOString().split('T')[0], // Get only the date part
        isActive: true,
      };

      // Observable to handle adding the new day
      dayObservable = this.dayService.addDay(newDateDto).pipe(
        switchMap(day => {
          this.newDayId = day.id;

          // Assign the new day ID to the performance DTO
          this.selectedPerformanceDto.dayId = this.newDayId;

          return this.performanceService.addPerformance(
            this.selectedPerformanceDto
          );
        })
      );
    } else {
      // If no new day is created, directly edit the performance
      dayObservable = this.performanceService.addPerformance(
        this.selectedPerformanceDto
      );
    }

    // Subscribe to the final observable
    dayObservable.subscribe({
      next: () => {
        console.log('PERFORMANCE UPDATED');
        this.refreshPerformances();
      },
      error: err => {
        this.errorMessage = err.message;
        this.errorToast.showToast();
      },
      complete: () => {
        this.cancelEdit();
      },
    });
  }

  onArtistSelected(artist: any) {
    this.selectedPerformanceDto.artistId = artist.id;
    this.artistService
      .getArtistById(this.selectedPerformanceDto.artistId)
      .subscribe(artist => (this.selectedArtist = artist));
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }

  onArtistCreated(artist: any) {
    this.selectedPerformanceDto.artistId = artist.id;
    this.artistService
      .getArtistById(this.selectedPerformanceDto.artistId)
      .subscribe({
        next: artist => (this.selectedArtist = artist),
        error: err => console.error('ERROR GETTING ARTIST BY ID', err),
      });
  }
  onStageCreated(stage: any) {
    this.selectedPerformanceDto.stageId = stage.id;
    this.stages$ = this.stageService.getStages();
  }

  closeModal() {
    this.createNewStage = false;
    this.createNewArtist = false;
  }
}
