import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  topPicks = [
    {
      title: 'The Whispering Woods',
      subtitle: 'A tale of magic and adventure',
      image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d',
    },
    {
      title: 'Echoes of Tomorrow',
      subtitle: 'Explore the future of space travel',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    },
    {
      title: 'The Silent Witness',
      subtitle: 'Unravel the secrets of a hidden crime',
      image: 'https://images.unsplash.com/photo-1553729784-e91953dec042',
    },
  ];

  newArrivals = [
    {
      title: 'Love in the Highlands',
      subtitle: 'A heartwarming story of love and loss',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Shadow Game',
      subtitle: 'A gripping thriller with unexpected twists',
      image:
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Queen’s Secret',
      subtitle: 'A historical novel set in the 18th century',
      image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade',
    },
  ];

  genres = [
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Thriller',
    'Historical Fiction',
  ];
}
