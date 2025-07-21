import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environment';
import { UserInfo } from '../../services/user-info';
import { CommonModule } from '@angular/common';

interface Message {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  message: string;
}

@Component({
  selector: 'app-dashboard-messages',
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-messages.html',
  styleUrl: './dashboard-messages.css'
})


export class DashboardMessages {

  private rootUrl = `${environment.apiUrl}`;
  messagesData: Message[] = [];
  constructor(
    private route: ActivatedRoute,
    @Inject(UserInfo) private userinfo: UserInfo,
    private http: HttpClient) {
    // Simulated data for demonstration purposes
    // this.messagesData = [
    //   {
    //     _id: 'Loading ...',
    //     name: 'Loading ...',
    //     email: 'Loading ...',
    //     createdAt: 'Loading ...',
    //     message: 'Loading ...'}
    // ];

    this.loadUsers(1);
  }

  
    isLoading = true;


  loadUsers(page: number) {
    const headers = new HttpHeaders({
      Authorization: `${this.userinfo.getToken()}`
    });
    this.isLoading = true;

    const params: any = {
      page,
      limit: 100,
    };

    this.http.get<any>(`${this.rootUrl}/api/v1/contactUs`, { headers })
      .subscribe({
        next: (response) => {
          //console.log(response.data);
          this.messagesData = response.data;
          this.isLoading = false;
          //this.loadUsers(1);
        },
        error: (err) => {
        }
      });
  }
}