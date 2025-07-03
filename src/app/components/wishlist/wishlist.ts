import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistItem } from './wishlist-item/wishlist-item';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, WishlistItem, NgbPaginationModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  wishlistService = inject(WishlistService);

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.refreshWishlist();
  }

  deleteItem(productId: string) {
    this.wishlistService.deleteFromWishlist(productId).subscribe({
      next: () => {
        this.loadWishlist();
      },
      error: () => {
        console.log('failed to delete');
      },
    });
  }

  // pagination
  page = 1;
  pageSize = 8;
  get paginatedWishlist() {
    const start = (this.page - 1) * this.pageSize;
    return this.wishlistService
      .wishlist()
      .wishlistItems.slice(start, start + this.pageSize);
  }

  get collectionSize() {
    return this.wishlistService.wishlist().wishlistItems.length;
  }
}
