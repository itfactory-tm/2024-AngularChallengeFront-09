import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketService } from '../../api/services/Tickets/ticket.service';
import { TicketResponseDto } from '../../api/dtos/Ticket/ticket-response-dto';
import { TicketRequestDto } from '../../api/dtos/Ticket/ticket-request-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent {
  constructor(private ticketService: TicketService){}
  @Output() ErrorEvent = new EventEmitter<string>();
  @Output() TicketCreatedEvent = new EventEmitter<TicketResponseDto>();
  @Input()
  edit = false;
  @Output()
  editChange = new EventEmitter<boolean>();
  @Input()
  selectedTicketId = '';
  @Input()
  selectedTicketDto: TicketRequestDto = {
    name: '',
    price: 0,
    description: '',
  };

  submitForm() {
    this.ticketService.addTicket(this.selectedTicketDto).subscribe({
      next: value => {
        this.TicketCreatedEvent.emit(value);
        this.ticketService.fetchTickets();
      },
      error: err => {
        this.ErrorEvent.emit(err.message);
      },
    });
    this.selectedTicketDto = {
      name: '',
      price: 0,
      description: '',
    };
  }

  submitEdit() {
    this.ticketService
      .updateTicket(this.selectedTicketId, this.selectedTicketDto)
      .subscribe(() => this.ticketService.fetchTickets());
    this.cancelEdit();
  }

  cancelEdit() {
    this.edit = false;
    this.editChange.emit(this.edit);
    this.selectedTicketDto = {
      name: '',
      price: 0,
      description: '',
    };
  }

}
