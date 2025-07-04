import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../models/product.model';
import e from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-products',
  templateUrl: './dashboard-products.html',
  styleUrl: './dashboard-products.css'
})

export class DashboardProducts {
  booksInventory: Products[] = [//list of all books in the store

  ];
  state:number = 0;

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
    if(this.state == 2)
      this.state = 0;
    else
    this.state = 2;
  }

  deleteBook(bookId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.booksInventory = this.booksInventory.filter(book => book._id !== bookId);
        Swal.fire('Deleted!', 'Book deleted successfully!', 'success');
        this.isLoading = false;
      }
    });
  }

  canAddBook(){
    if(this.state == 1)
      this.state = 0;
    else
    this.state = 1;
  }

  addBook(){
    // Add your validation and API logic here
    // On success:
    Swal.fire('Success', 'Book added successfully!', 'success');
    // On error:
    // Swal.fire('Error', 'Error message', 'error');
  }

  updateBook(){
    // Add your validation and API logic here
    // On success:
    Swal.fire('Success', 'Book updated successfully!', 'success');
    // On error:
    // Swal.fire('Error', 'Error message', 'error');
  }
}
