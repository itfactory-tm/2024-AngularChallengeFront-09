import { Component, Input, OnInit } from '@angular/core';
import { StageResponseDto } from '../../api/dtos/Stage/stage-response-dto';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [],
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})

export class StageComponent {
	baseUrl = `${environment.baseUrl}/..`;
	
	@Input()
	stage!:StageResponseDto;
}
