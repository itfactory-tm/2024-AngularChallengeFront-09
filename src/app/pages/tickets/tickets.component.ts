import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../api/services/Tickets/ticket.service';
import { Observable } from 'rxjs';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TicketResponseDto } from '../../api/dtos/Ticket/ticket-response-dto';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [TicketComponent, RouterModule, AsyncPipe],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit{
	ticketList$!: Observable<TicketResponseDto[]>;

	constructor(private ticketService: TicketService) {}

	ngOnInit(): void {
	  this.ticketList$ = this.ticketService.getTickets();
	}
}
