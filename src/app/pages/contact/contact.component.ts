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
    { id: 1, question: 'How can I place an order?', answer: 'You can place an order through our website.' },
    { id: 2, question: 'What are the shipping costs?', answer: 'Shipping costs depend on your location.' },
    { id: 3, question: 'How can I track my order?', answer: 'You will receive a tracking number once your order is shipped.' },
    { id: 4, question: 'When is Laser Lama?', answer: 'Laser Lama will take place the weekend of August 1, 2 and 3 in 2025.'}
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

