import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../models/product.model';

@Component({
  selector: 'app-dashboard-products',
  templateUrl: './dashboard-products.html',
  styleUrl: './dashboard-products.css'
})

export class DashboardProducts {
  booksInventory: Products[] = [//list of all books in the store

  ];

  constructor(
    private productService: Product,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadBooks(1)
  }

  isLoading = true;


  loadBooks(page: number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit: 100,
    };

    this.productService.getAllProducts(params).subscribe({
      next: (res) => {
        this.booksInventory = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.booksInventory = [];
        }
        this.isLoading = false;
      },
    });
  }

  viewBook(bookId: string): void {
    console.log('View book:', bookId);
  }

  editBook(bookId: string): void {
    console.log('Edit book:', bookId);
  }

  deleteBook(bookId: string): void {
    console.log('Delete book:', bookId);
    this.booksInventory = this.booksInventory.filter(book => book._id !== bookId);
  }
}
