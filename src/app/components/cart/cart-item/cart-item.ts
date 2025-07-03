import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
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
    Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your item has been deleted.',
          icon: 'success',
        });
        this.remove.emit(this.item.productId);
      }
    });
  }
}
