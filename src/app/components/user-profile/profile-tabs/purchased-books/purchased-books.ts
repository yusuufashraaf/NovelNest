import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchased-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchased-books.html',
  styleUrls: ['./purchased-books.css'],
})
  

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
}