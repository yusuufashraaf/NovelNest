import { Component } from '@angular/core';

@Component({
  selector: 'app-purchased-books',
  imports: [],
  templateUrl: './purchased-books.html',
  styleUrl: './purchased-books.css',
})
<<<<<<< Updated upstream
export class PurchasedBooks {
  books = [
    {
      title: 'The Secret Garden',
      author: 'Frances Bennett',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    },
  ];
=======
export class PurchasedBooks implements OnInit {
  orders: any[] = [];
  loading = true;

  private orderService = inject(OrdersService);

  ngOnInit() {
    this.orderService
      .getMyOrders()
      .pipe(
        catchError((error) => {
          this.loading = false;
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'Please log in first',
              showConfirmButton: true,
            });
          }
          return of({ data: [] });
        })
      )
      .subscribe((response) => {
        this.orders = response?.data || [];
        this.loading = false;
      });
  }
>>>>>>> Stashed changes
}
