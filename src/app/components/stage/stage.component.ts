import { Component, Input, OnInit } from '@angular/core';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';


@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [],
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})

export class StageComponent {
 @Input()
 stage!:StageResponseDto;
}
