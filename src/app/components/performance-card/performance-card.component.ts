import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceResponseDto } from '../../api/dtos/Performance/performance-response-dto';

@Component({
  selector: 'app-performance-card',
  templateUrl: './performance-card.component.html',
  styleUrls: ['./performance-card.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PerformanceCardComponent {
  @Input({ required: true }) performance!: PerformanceResponseDto;
}