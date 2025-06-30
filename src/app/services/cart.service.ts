import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal([
    {
      id: 1,
      title: 'The Midnight Garden',
      author: 'F. Scott Fitzgerald',
      img: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=80&h=110',
      url: 'https://example.com/gatsby',
      stock: 10,
      price: 15.99,
    },
    {
      id: 2,
      title: '1984',
      author: 'Echoes of the Past',
      img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&h=110',
      url: 'https://example.com/1984',
      stock: 5,
      price: 24.49,
    },
    {
      id: 3,
      title: 'Whispers of the Wind',
      author: 'Harper Lee',
      img: 'https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&w=80&h=110',
      url: 'https://example.com/mockingbird',
      stock: 8,
      price: 14.25,
    },
  ]);
  constructor() {}
}
