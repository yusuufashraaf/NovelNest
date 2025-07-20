import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.css'],
})
export class OrdersHistory implements OnInit {
  orders: any[] = [];
  booksSummary: any[] = [];
  loading = true;
  error: string = '';

  constructor(private ordersService: OrdersService) {}
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  ngOnInit() {
    this.ordersService.getAllMyOrders().subscribe({
      next: (res) => {

        this.orders = res.data?.orders || [];
        this.booksSummary = res.data?.booksSummary || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      },
    });
  }
}
