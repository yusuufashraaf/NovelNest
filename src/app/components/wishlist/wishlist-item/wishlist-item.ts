import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AddToCart } from '../../add-to-cart/add-to-cart';
import { WishlistService } from '../../../services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [AddToCart],
  templateUrl: './wishlist-item.html',
  styleUrl: './wishlist-item.css',
})
export class WishlistItem {
  @Input() item!: {
    productId: string;
    title: string;
    author: string;
    img: string;
  };
  wishlistService = inject(WishlistService);

  @Output() remove = new EventEmitter<string>();

  removeItem() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed from your wishlist.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your item has been removed from your wishlist.',
          icon: 'success',
        });
        this.remove.emit(this.item.productId);
      }
    });
  }

  wishlistHandler(productId: string) {
    if (!productId) return;
    this.wishlistService.deleteFromWishlist(productId).subscribe({
      next: (res) => {},
      error: () => {
        Swal.fire({
          title: 'Failed to remove from wishlist.',
          icon: 'error',
        });
      },
    });
  }
}
