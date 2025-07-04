import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { CategoryService, Category } from './category.service';
import { SubcategoryService, Subcategory } from './subcategory.service';

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface MonthlyProductData {
  month: string;
  count: number;
}

export interface CategoryProductData {
  category: string;
  count: number;
}

export interface DashboardChartData {
  monthlyProducts: ChartData;
  categoryProducts: ChartData;
  totalRevenue: number;
  totalOrders: number;
  recentOrders: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private baseUrl = 'http://localhost:5000/api/v1';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  // Get all data needed for dashboard charts
  getDashboardChartData(): Observable<DashboardChartData> {
    return forkJoin({
      products: this.getProductsForCharts(),
      orders: this.getOrdersForCharts().pipe(catchError(() => of([]))),
      users: this.getUsersForCharts().pipe(catchError(() => of([]))),
      categories: this.categoryService.getAllWithoutPagination().pipe(catchError(() => of({ data: [] }))),
      subcategories: this.subcategoryService.getAll().pipe(catchError(() => of([])))
    }).pipe(
      map(({ products, orders, users, categories, subcategories }) => {
        const monthlyProducts = this.processMonthlyProductData(products);
        const categoryProducts = this.processCategoryProductData(products, categories.data || [], subcategories);
        const totalRevenue = this.calculateTotalRevenue(orders);
        const totalOrders = orders.length;
        const recentOrders = this.getRecentOrders(orders);

        return {
          monthlyProducts,
          categoryProducts,
          totalRevenue,
          totalOrders,
          recentOrders
        };
      }),
      catchError(error => {
        return of({
          monthlyProducts: { labels: [], data: [] },
          categoryProducts: { labels: [], data: [] },
          totalRevenue: 0,
          totalOrders: 0,
          recentOrders: []
        });
      })
    );
  }

  // Get products data for charts
  private getProductsForCharts(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/products`).pipe(
      map(response => {
        return response.data || response || [];
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  // Get orders data for charts (if endpoint exists)
  private getOrdersForCharts(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/orders`).pipe(
      map(response => {
        return response.data || response || [];
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  // Get users data for charts
  getUsersForCharts(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/users`).pipe(
      map(response => {
        return response.data || response || [];
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  // Process monthly product data for chart
  private processMonthlyProductData(products: any[]): ChartData {
    const monthlyProducts: { [key: string]: number } = {};
    const currentDate = new Date();

    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlyProducts[monthYear] = 0;
    }

    // Count products by creation month
    products.forEach(product => {
      if (product.createdAt) {
        const monthYear = new Date(product.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthlyProducts[monthYear] = (monthlyProducts[monthYear] || 0) + 1;
      }
    });

    const labels = Object.keys(monthlyProducts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = labels.map(label => monthlyProducts[label]);

    return { labels, data };
  }

  // Process category product data for chart with real category names
  private processCategoryProductData(products: any[], categories: Category[], subcategories: Subcategory[]): ChartData {
    const categoryProducts: { [key: string]: number } = {};

    // Create maps for quick lookup
    const categoryMap = new Map(categories.map(cat => [cat._id, cat.name]));
    const subcategoryMap = new Map(subcategories.map(sub => [sub._id, sub.name]));

    products.forEach(product => {
      let categoryName = 'Unknown Category';

      // Try to get category name from different possible structures
      if (product.category?.name) {
        categoryName = product.category.name;
      } else if (product.categoryName) {
        categoryName = product.categoryName;
      } else if (product.subcategory && Array.isArray(product.subcategory) && product.subcategory.length > 0) {
        // Try to resolve subcategory IDs to names
        const subcategoryNames = product.subcategory
          .map((subId: string) => subcategoryMap.get(subId))
          .filter((name: string | undefined) => name) // Remove undefined values
          .slice(0, 2); // Take first 2 subcategory names

        if (subcategoryNames.length > 0) {
          categoryName = subcategoryNames.join(' / ');
        } else {
          // If we can't resolve subcategory names, use author as fallback
          categoryName = product.author || 'Unknown Category';
        }
      } else if (product.author) {
        // Use author as fallback if no category/subcategory info
        categoryName = product.author;
      }

      categoryProducts[categoryName] = (categoryProducts[categoryName] || 0) + 1;
    });

    // Sort by count and take top 5 categories
    const sortedCategories = Object.entries(categoryProducts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const labels = sortedCategories.map(([category]) => category);
    const data = sortedCategories.map(([, count]) => count);

    return { labels, data };
  }

  // Calculate total revenue from orders
  private calculateTotalRevenue(orders: any[]): number {
    return orders.reduce((total, order) => {
      return total + (order.totalPrice || 0);
    }, 0);
  }

  // Get recent orders for dashboard
  private getRecentOrders(orders: any[]): any[] {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  // Get specific chart data by type
  getMonthlyProductChart(): Observable<ChartData> {
    return this.getProductsForCharts().pipe(
      map(products => this.processMonthlyProductData(products))
    );
  }

  getCategoryProductChart(): Observable<ChartData> {
    return forkJoin({
      products: this.getProductsForCharts(),
      categories: this.categoryService.getAllWithoutPagination().pipe(catchError(() => of({ data: [] }))),
      subcategories: this.subcategoryService.getAll().pipe(catchError(() => of([])))
    }).pipe(
      map(({ products, categories, subcategories }) =>
        this.processCategoryProductData(products, categories.data || [], subcategories)
      )
    );
  }

  // Get revenue data for charts
  getRevenueData(): Observable<ChartData> {
    return this.getOrdersForCharts().pipe(
      map(orders => {
        const monthlyRevenue: { [key: string]: number } = {};
        const currentDate = new Date();

        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          monthlyRevenue[monthYear] = 0;
        }

        // Sum revenue by month
        orders.forEach(order => {
          if (order.createdAt && order.totalPrice) {
            const monthYear = new Date(order.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
            monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + order.totalPrice;
          }
        });

        const labels = Object.keys(monthlyRevenue).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const data = labels.map(label => monthlyRevenue[label]);

        return { labels, data };
      }),
      catchError(() => of({ labels: [], data: [] }))
    );
  }
}
