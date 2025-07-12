import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environment';
export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardChartData {
  monthlyProducts: ChartData;
  categoryProducts: ChartData;
  totalRevenue: number;
  totalOrders: number;
  userCount: number;
  totalBooks: number;
  recentOrders: any[];
}

@Injectable({ providedIn: 'root' })
export class ChartService {
      private rootUrl = `${environment.apiUrl}`;
  private baseUrl = `${this.rootUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getDashboardChartData(): Observable<DashboardChartData> {
    return forkJoin({
      products: this.getProducts(),
      orders: this.getOrders(),
      users: this.getUsers()
    }).pipe(
      map(({ products, orders, users }) => {
        const monthlyProducts = this.processMonthlyProducts(products);
        const categoryProducts = this.processCategories(products);
        const totalRevenue = this.calculateRevenue(orders);
        const totalOrders = orders.length;
        const recentOrders = this.getRecentOrders(orders);
        return {
          monthlyProducts,
          categoryProducts,
          totalRevenue,
          totalOrders: orders.length,
          userCount: users.length,
          totalBooks: products.length,
          recentOrders: this.getRecentOrders(orders)
        };
      }),
      catchError(() => this.getDefaultData())
    );
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`).pipe(
      map(response => response),
      catchError(() => of([]))
    );
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/all-orders`).pipe(
      map(response => response),
      catchError(() => of([]))
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`).pipe(
      map(response => response),
      catchError(() => of([]))
    );
  }

  getChart1(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/noofordersincategory`).pipe(
      map(response => response),
      catchError(() => of([]))
    );
  }

  private processMonthlyProducts(products: any[]): ChartData {
    const monthlyCounts: Record<string, number> = {};
    const currentDate = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlyCounts[monthYear] = 0;
    }

    // Count products by month
    products.forEach(product => {
      if (product.createdAt) {
        const monthYear = new Date(product.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
      }
    });

    const labels = Object.keys(monthlyCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = labels.map(label => monthlyCounts[label]);

    return { labels, data };
  }

  private processCategories(products: any[]): ChartData {
    const categoryCounts: Record<string, number> = {};

    products.forEach(product => {
      const category = product.category?.name || product.categoryName || product.author || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const sorted = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sorted.map(([category]) => category),
      data: sorted.map(([, count]) => count)
    };
  }

  private calculateRevenue(orders: any[]): number {
    return orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  }

  private getRecentOrders(orders: any[]): any[] {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  private getDefaultData(): Observable<DashboardChartData> {
    return of({
      monthlyProducts: { labels: [], data: [] },
      categoryProducts: { labels: [], data: [] },
      totalRevenue: 0,
      totalOrders: 0,
      userCount: 0,
      totalBooks: 0,
      recentOrders: []
    });
  }
}