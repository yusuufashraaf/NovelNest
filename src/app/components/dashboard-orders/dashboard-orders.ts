import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '../../services/order.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInfo } from '../../services/user-info';
import { Users } from '../../services/users';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environment';
import { CommonModule } from '@angular/common';
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
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css'
})
export class DashboardOrders {
        private rootUrl = `${environment.apiUrl}`;
  
  allOrders: Order[] = [//list of all books in the store

  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    @Inject(UserInfo) private userinfo: UserInfo,
    private http: HttpClient
  ) {
    this.getAllOrdersAPI();
  }

  isLoading = true;

getAllOrdersAPI() {
    const headers = new HttpHeaders({
      Authorization: `${this.userinfo.getToken()}`
    });

    this.http.get<any>(`${this.rootUrl}/api/v1/orders/all-orders`, { headers })
      .subscribe({
        next: (response) => {
          //console.log(response.data);
          
          this.allOrders= response.data;
        },
        error: (err) => {
        }
      });
  }

}
