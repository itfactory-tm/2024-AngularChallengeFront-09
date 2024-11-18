import { Component } from '@angular/core';
import { TicketDto } from '../../api/dtos/ticket-dto';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
ticket!: TicketDto
}
