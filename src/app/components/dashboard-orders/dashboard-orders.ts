import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Order {
  _id: string;
  userId: string;
  items: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'paypal' | 'credit-card' | 'cash-on-delivery';
  orderNumber: string;
  paypalOrderId: string;
  transactionRef: string;
  createdAt: Date;
  updatedAt?: Date;
  paidAt?: Date;
  paypalCaptureId?: string;
}

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadOrders(1,100)
  }

  isLoading = true;


  loadOrders(page: number,limit:number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit,
    };

    this.isLoading = false;
  }
}
