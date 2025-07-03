import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, Users } from '../../services/users';

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
UsersData: User[] = [];

  constructor(
    private usersService: Users,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUsers(1)
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
  },
  error: (err) => {
    console.error('Error loading users:', err);
    // Show error to user
  }
});
  }
}
