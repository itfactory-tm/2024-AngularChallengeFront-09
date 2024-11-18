import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../api/services/Tickets/ticket.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketDto } from '../../api/dtos/ticket-dto';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit{
  TicketList!: TicketDto[];
  TicketList$!: Observable<TicketDto[]>;
  ticket!: TicketDto;

  constructor(private ticketService: TicketService){ }

  ngOnInit(): void {
    this.TicketList$ = this.ticketService.getTickets();
  }
}
