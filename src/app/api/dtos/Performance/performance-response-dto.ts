import { ArtistResponseDto } from '../Artist/artist-response-dto';
import { DayResponseDto } from '../Day/day-response-dto';
import { StageResponseDto } from '../Stage/stage-response-dto';

export interface PerformanceResponseDto {
  id: string;
  artist: ArtistResponseDto;
  stage: StageResponseDto;
  day: DayResponseDto;
  startTime: string;
  endTime: string;
}
