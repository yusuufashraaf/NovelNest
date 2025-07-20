import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, Users } from '../../services/users';
import { userInfo } from 'os';
import { UserInfo } from '../../services/user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';

// interface User{
//   _id:string
//   name:string,
//   email:string,
//   role:string,
//   createdAt:Date
// }

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.html',
  styleUrl: './dashboard-users.css'
})
export class DashboardUsers {
      private rootUrl = `${environment.apiUrl}`;
  
  UsersData: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: Users,
    @Inject(UserInfo) private userinfo: UserInfo,
    private http: HttpClient
  ) {
    this.loadUsers(1);
  }

  

  ToggleUserState(id:string,state:boolean) {
    const headers = new HttpHeaders({
      Authorization: `${this.userinfo.getToken()}`
    });
    console.log(id,state);
    

    if(state){
      console.log("deactivate");
      this.http.post<any>(`${this.rootUrl}/api/v1/users/deactivate/` + id, { headers })
      .subscribe({
        next: (response) => {
          this.loadUsers(1);
        },
        error: (err) => {
        }
      });
    }
    else{
      console.log("reactivate");
      this.http.post<any>(`${this.rootUrl}/api/v1/users/reactivate/` + id, { headers })
      .subscribe({
        next: (response) => {
          this.loadUsers(1);
        },
        error: (err) => {
        }
      });
    }
  }

  editRole(id:string) {
    const headers = new HttpHeaders({
      Authorization: `${this.userinfo.getToken()}`
    });

    this.http.post<any>(`${this.rootUrl}/api/v1/users/changerole/` + id, { headers })
      .subscribe({
        next: (response) => {
          this.loadUsers(1);
        },
        error: (err) => {
        }
      });
  }



  isLoading = true;


  loadUsers(page: number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit: 100,
    };

    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.UsersData = users;
        //console.log(this.UsersData);

      },
      error: (err) => {
        // Show error to user
      }
    });
  }
}
