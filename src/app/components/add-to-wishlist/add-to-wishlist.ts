import { Component, Input } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-to-wishlist',
  standalone: true,
  templateUrl: './add-to-wishlist.html',
  styleUrls: ['./add-to-wishlist.css'],
})
export class AddToWishlist {
  @Input() productId!: string;

  constructor(private wishlistService: WishlistService) {}

  addToWishlist() {
    if (!this.productId) return;
    this.wishlistService.addToWishlist(this.productId).subscribe({
      // update wishlist icon simultaneously
      next: () => {
        this.wishlistService.refreshWishlist();
        // show success message with sweetalert2
        Swal.fire({
          title: 'Added to wishlist!',
          icon: 'success',
        });
      },
      error: () => {
        Swal.fire({
          // show error message with sweetalert2
          title: 'Item already in wishlist.',
          icon: 'warning',
        });
      },
    });
  }
}
