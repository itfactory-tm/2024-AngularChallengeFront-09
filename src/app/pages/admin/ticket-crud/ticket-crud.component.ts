import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketService } from '../../../api/services/Tickets/ticket.service';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../../components/error-toast/error-toast.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TicketResponseDto } from '../../../api/dtos/Ticket/ticket-response-dto';
import { TicketRequestDto } from '../../../api/dtos/Ticket/ticket-request-dto';
import { TicketFormComponent } from "../../../components/ticket-form/ticket-form.component";



@Component({
  selector: 'app-ticket-crud',
  standalone: true,
  imports: [FormsModule, ErrorToastComponent, AsyncPipe, TicketFormComponent, CommonModule],
  templateUrl: './ticket-crud.component.html',
  styleUrl: './ticket-crud.component.css'
})
export class TicketCrudComponent implements OnInit{


  @ViewChild('errorToast') errorToast!: ErrorToastComponent;
  errorMessage = '';
  tickets$!: Observable<TicketResponseDto[]>;
  edit = false;
  selectedTicketId = '';
  selectedTicketDto: TicketRequestDto = {
    name: '',
    price: 0,
    description: '',
  }

  constructor(private ticketService: TicketService){}

  ngOnInit(){
    this.ticketService.fetchTickets();
    this.tickets$ = this.ticketService.tickets$;
  }

  scrollToForm() {
    const offset = 220; // Height of the navbar
    const targetPosition = document.getElementById('crudFormTitle');

    if (targetPosition) {
      if (window.outerWidth < 800) {
        console.log("SCROLLLLING");
        window.scrollTo({
          top: targetPosition.offsetTop - offset,
          behavior: 'smooth',
        });
      }
    }
  }

  editTicket(ticket: TicketResponseDto) {
    this.edit = true;
    this.selectedTicketId = ticket.id;
    this.selectedTicketDto = {
      name: ticket.name,
      price: ticket.price,
      description: ticket.description,
    };
    this.scrollToForm();
  }

  deleteTicket(id: string) {
    this.ticketService
    .deleteTicket(id)
    .subscribe(() => this.ticketService.fetchTickets());
  }

  onErrorEvent(message: string) {
    this.errorMessage = message;
    this.errorToast.showToast();
  }

}
