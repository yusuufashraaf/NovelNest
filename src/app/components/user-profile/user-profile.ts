import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { ProfileTabs } from './profile-tabs/profile-tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ProfileTabs],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;

  defaultName = 'Guest User';
  defaultPic = 'https://i.pravatar.cc/00';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.fetchLoggedInUser().subscribe({
      next: (response) => {
        this.user = response.data.user;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user profile';
        this.isLoading = false;
      }
    });
  }
}
