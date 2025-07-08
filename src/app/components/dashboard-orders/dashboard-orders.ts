import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '../../services/order.service';

// interface Order {
//   _id: string;
//   userId: string;
//   items: {
//     bookId: string;
//     quantity: number;
//     price: number;
//   }[];
//   totalPrice: number;
//   status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   shippingAddress: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   paymentMethod: 'paypal' | 'credit-card' | 'cash-on-delivery';
//   orderNumber: string;
//   paypalOrderId: string;
//   transactionRef: string;
//   createdAt: Date;
//   updatedAt?: Date;
//   paidAt?: Date;
//   paypalCaptureId?: string;
// }

@Component({
  selector: 'app-dashboard-orders',
  imports: [],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css'
})
export class DashboardOrders {
allOrders: Order[] = [//list of all books in the store

  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadOrders(1,100)
  }

  isLoading = true;


  loadOrders(page: number,limit:number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit: 100,
    };

    this.orderService.getAllOrders(params).subscribe({
      next: (res) => {
        this.allOrders = res.data || [];
        this.isLoading = false;
        console.log('✅ Books loaded successfully:', this.allOrders.length);
      },
      error: (err) => {
        console.error('❌ Error loading books:', err);
        if (err.status === 404) {
          this.allOrders = [];
        }
        this.isLoading = false;
      },
    });
}
}
