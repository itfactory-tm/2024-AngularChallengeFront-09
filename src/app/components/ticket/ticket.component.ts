import { Component, Input } from '@angular/core';
import { TicketResponseDto } from '../../api/dtos/Ticket/ticket-response-dto';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent{	
	@Input()
	ticket!:TicketResponseDto;
}
