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
    if (!this.item?.productId) {
      Swal.fire({
        title: 'Error',
        text: 'Product information is missing. Please refresh the page.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.quantityChange.emit({
      productId: this.item.productId,
      quantity: this.item.quantity + 1,
    });
  }

  decrease() {
    if (!this.item?.productId) {
      Swal.fire({
        title: 'Error',
        text: 'Product information is missing. Please refresh the page.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.item.quantity > 1) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: this.item.quantity - 1,
      });
    } else {
      // If quantity is 1, show confirmation to remove the item instead
      this.removeItem();
    }
  }

  removeItem() {
    if (!this.item?.productId) {
      Swal.fire({
        title: 'Error',
        text: 'Product information is missing. Please refresh the page.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Remove item?',
      text: `Are you sure you want to remove "${this.item.title}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.remove.emit(this.item.productId);
        // Success message will be handled by the parent component
        // based on the API response
      }
    });
  }
}
