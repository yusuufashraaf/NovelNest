import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  imports: [],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css'
})

export class ContactUs {
formData = {
    name: '',
    email: '',
    message: ''
  };


  onSubmit() {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', this.formData);
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form after submission
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }

  startChat() {
    console.log("Chat Started");
  }
}

