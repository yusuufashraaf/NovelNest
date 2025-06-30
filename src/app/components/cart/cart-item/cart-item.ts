import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartItem {
  item = input.required<{
    id: number;
    title: string;
    author: string;
    img: string;
    stock: number;
    price: number;
  }>();
}
