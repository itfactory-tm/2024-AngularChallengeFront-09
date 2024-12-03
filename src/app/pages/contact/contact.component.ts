import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../components/toast/toast.component';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent{
  toastMessage = '';
  @ViewChild('Toast') toast!: ToastComponent;
  // FAQs data
  faqs = [
    { id: 1, question: 'How can I purchase tickets for the festival?', answer: 'Your festival ticket grants you access to all festival activities, including live performances, art installations, food and drink stalls, and other special events. Additional perks like VIP access or exclusive experiences may be available depending on your ticket type.' },
    { id: 2, question: 'What is included with my festival ticket?', answer: 'Your festival ticket grants you access to all festival activities, including live performances, art installations, food and drink stalls, and other special events. Additional perks like VIP access or exclusive experiences may be available depending on your ticket type.' },
    { id: 3, question: 'Are there age restrictions for the festival?', answer: 'The festival is open to all ages. However, minors must be accompanied by an adult. Some performances or areas may have age restrictions, so please check the event details for specific shows.' },
    { id: 4, question: 'When does Laser Llama take place?', answer: 'Laser Llama will take place the weekend of August 1, 2 and 3 in 2025.'},
    { id: 5, question: 'What should I bring to the festival?', answer: 'We recommend bringing your ticket (printed or digital), a valid ID, sunscreen, comfortable clothing, a hat, and a refillable water bottle. Be sure to check the weather forecast and dress accordingly!' },
    { id: 6, question: 'Can I bring food or drinks into the festival?', answer: 'Outside food and drinks are not permitted in the festival grounds. However, there will be a wide variety of food and drink vendors offering meals, snacks, and refreshments. If you have special dietary needs, please contact us in advance.'},
    { id: 7, question: 'Are there accessible services for people with disabilities?', answer: 'Yes, the festival is fully accessible, with ramps, accessible toilets, and designated viewing areas for guests with disabilities. If you require any specific accommodations, please let us know ahead of time, and we will do our best to assist you.' },
    { id: 8, question: 'Can I volunteer at the festival?', answer: 'Yes, we are always looking for passionate volunteers to help with the festival! Please visit our "Get Involved" page on our website for more information on how to apply and the benefits of volunteering.'}
  ];

  openFaqId: number | null = null;
  

  // Toggles FAQ sections
  toggleFaq(faqId: number) {
    this.openFaqId = this.openFaqId === faqId ? null : faqId;
  }

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  // Handle form submission
  onSubmit() {
    console.log('Form submitted:', this.contactForm);

    this.toastMessage = 'Thank you for your message! We will get back to you soon.';
    this.toast.showToast()

    this.contactForm = { name: '', email: '', message: '' };
  }
}

