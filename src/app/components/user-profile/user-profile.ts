import { Component } from '@angular/core';
import { ProfileTabs } from "../profile-tabs/profile-tabs";

@Component({
  selector: 'app-user-profile',
  imports: [ProfileTabs],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {

}
