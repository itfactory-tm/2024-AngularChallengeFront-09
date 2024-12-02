import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCrudComponent } from './ticket-crud.component';

describe('TicketCrudComponent', () => {
  let component: TicketCrudComponent;
  let fixture: ComponentFixture<TicketCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
