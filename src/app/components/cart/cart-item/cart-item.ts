import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartItem {
  @Input() item!: {
    productId: string;
    title: string;
    author: string;
    img: string;
    price: number;
    quantity: number;
    subtotal: number;
  };

  @Output() quantityChange = new EventEmitter<{
    productId: string;
    quantity: number;
  }>();
  @Output() remove = new EventEmitter<string>();

  increase() {
    this.quantityChange.emit({
      productId: this.item.productId,
      quantity: this.item.quantity + 1,
    });
  }

  decrease() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: this.item.quantity - 1,
      });
    }
  }

  removeItem() {
    this.remove.emit(this.item.productId);
  }
}
