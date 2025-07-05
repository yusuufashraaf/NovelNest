import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {
  teamMembers = [
    { 
      name: 'Joe Ashraf', 
      position: 'CAO',
      bio: 'Leads our artistic vision and creative direction',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    { 
      name: 'Mahmoad 7alemo', 
      position: 'CBO',
      bio: 'Drives our business strategy and partnerships',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    { 
      name: 'Mohamed Tar', 
      position: 'CBC',
      bio: 'Oversees all content creation and curation',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    { 
      name: 'Ahmed Kemo', 
      position: 'CDO',
      bio: 'Leads our digital transformation and technology',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    { 
      name: 'Mohamed Mostafa', 
      position: 'General Product, Super Manager & Frontend',
      bio: 'Manages product development and frontend engineering',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    { 
      name: 'Eyaaaaad', 
      position: 'General Product, Super Manager & Backend',
      bio: 'Manages product development and backend engineering',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }
  ];
}