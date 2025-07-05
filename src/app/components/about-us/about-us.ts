import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {
teamMembers = [
    { name: 'Sarah Chen', position: 'CEO & Founder' },
    { name: 'David Lee', position: 'Head of Technology' },
    { name: 'Emily Rodriguez', position: 'Community Manager' }
  ];
}
