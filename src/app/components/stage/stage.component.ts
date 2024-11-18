import { Component, Input, OnInit } from '@angular/core';
import { StageDto } from '../../api/dtos/stage-dto';


@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [],
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})

export class StageComponent {
 @Input()
 stage!:StageDto;
}
