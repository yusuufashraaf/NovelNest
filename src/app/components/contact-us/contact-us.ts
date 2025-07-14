import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit {
      private rootUrl = `${environment.apiUrl}`;
  formData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.formData.name = decoded.name || '';
        this.formData.email = decoded.email || '';
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to send a message.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post(
        `${this.rootUrl}/api/v1/contactUs`,
        { message: this.formData.message },
        { headers }
      )
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.formData.message = '';
        },
        error: (err) => {
          console.error('Contact form submission error:', err);
          alert(
            err.error?.message || 'Something went wrong. Please try again.'
          );
        },
      });
  }

  startChat() {
    console.log('Chat Started');
  }
}
