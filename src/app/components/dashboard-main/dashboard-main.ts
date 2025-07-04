import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomerActivity, StoreInitiative, StoreMetric } from '../dashboard/dashboard';
import { Users } from '../../services/users';
import { Product } from '../../services/product.service';
import { OrderService, Order } from '../../services/order.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard-main',
  imports: [],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css'
})
export class DashboardMain implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef;
  @ViewChild('categorySalesChart') categorySalesChartRef!: ElementRef;

  storeMetrics: StoreMetric[] = [
    { title: 'Monthly Revenue', value: '$0', icon: 'bi bi-currency-dollar', color: 'bg-primary', change: 0 },
    { title: 'New Customers', value: '0', icon: 'bi bi-people', color: 'bg-success', change: 0 },
    { title: 'New Books', value: '0', icon: 'bi bi-book', color: 'bg-info', change: 0 },
    { title: 'New Orders', value: '0', icon: 'bi bi-cart', color: 'bg-warning', change: 0 }
  ];

  recentCustomerActivities: CustomerActivity[] = [];

  storeInitiatives: StoreInitiative[] = [];

  salesTrendChart: any;
  categorySalesChart: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private http: HttpClient,
              private usersService: Users,
              private productService: Product,
              private orderService: OrderService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    console.log('🚀 Dashboard Main Component Initialized');
    this.FetchData();
  }

    async FetchData() {
    forkJoin({
      users: this.usersService.getAllUsers(),
      products: this.productService.getAllProducts({}),
      allOrders: this.orderService.getAllOrders(1, 1000), // Fetch all orders to calculate totals
      recentOrders: this.orderService.getRecentOrders(5)
    }).pipe(
      map(({ users, products, allOrders, recentOrders }) => {
        // Debug logging to verify data
        console.log('🔍 Dashboard Data Debug:');
        console.log('Users:', users.length, users);
        console.log('Products:', products.data?.length || 0, products.data);
        console.log('All Orders:', allOrders.data?.length || 0, allOrders.data);
        console.log('Recent Orders:', recentOrders.length, recentOrders);

        const userMap = new Map(users.map(user => [user._id, user.name]));
        const productMap = new Map<string, { title: string, categoryName: string }>();

        // Handle different product data structures
        if (products.data && Array.isArray(products.data)) {
          products.data.forEach((product: any) => {
            const title = product.title || product.name || product.productName || 'Unknown Book';
            const categoryName = product.category?.name || product.categoryName || 'Unknown Category';
            productMap.set(product._id, { title, categoryName });
          });
        }

        // Calculate store metrics
        const totalRevenue = allOrders.data?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;
        const newCustomers = users.length; // Total users
        const newBooks = products.data?.length || 0; // Total products
        const newOrders = allOrders.total || 0; // Total orders

        this.storeMetrics = [
          { title: 'Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'bi bi-currency-dollar', color: 'bg-primary', change: 0 },
          { title: 'New Customers', value: newCustomers.toLocaleString(), icon: 'bi bi-people', color: 'bg-success', change: 0 },
          { title: 'New Books', value: newBooks.toLocaleString(), icon: 'bi bi-book', color: 'bg-info', change: 0 },
          { title: 'New Orders', value: newOrders.toLocaleString(), icon: 'bi bi-cart', color: 'bg-warning', change: 0 }
        ];

        // Map recent customer activities
        this.recentCustomerActivities = recentOrders.map(order => ({
          id: order._id,
          customerName: userMap.get(order.userId) || `User ${order.userId}`, // Resolve user name
          booksPurchased: order.items?.map(item => {
            const productInfo = productMap.get(item.bookId);
            return productInfo ? productInfo.title : `Book ID: ${item.bookId}`;
          }) || [],
          date: new Date(order.createdAt).toLocaleString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userMap.get(order.userId) || order.userId)}&background=random`
        }));

        // Prepare data for charts
        const monthlySalesData = this.getMonthlySalesData(allOrders.data || []);
        const categorySalesData = this.getCategorySalesData(allOrders.data || [], productMap);

        if (this.salesTrendChart) this.salesTrendChart.destroy();
        if (this.categorySalesChart) this.categorySalesChart.destroy();

        this.createCharts(monthlySalesData.labels, monthlySalesData.data, categorySalesData.labels, categorySalesData.data);

        // Debug logging for calculated metrics
        console.log('📊 Calculated Metrics:');
        console.log('Store Metrics:', this.storeMetrics);
        console.log('Recent Activities:', this.recentCustomerActivities);
        console.log('Monthly Sales Data:', monthlySalesData);
        console.log('Category Sales Data:', categorySalesData);

      })
    ).subscribe({
      next: (data) => {
        console.log('✅ Dashboard data loaded successfully:', data);
      },
      error: (err) => {
        console.error('❌ Error fetching dashboard data:', err);
        // Set default values if data fails to load
        this.storeMetrics = [
          { title: 'Monthly Revenue', value: '$0', icon: 'bi bi-currency-dollar', color: 'bg-primary', change: 0 },
          { title: 'New Customers', value: '0', icon: 'bi bi-people', color: 'bg-success', change: 0 },
          { title: 'New Books', value: '0', icon: 'bi bi-book', color: 'bg-info', change: 0 },
          { title: 'New Orders', value: '0', icon: 'bi bi-cart', color: 'bg-warning', change: 0 }
        ];
        this.recentCustomerActivities = [];
      }
    });
  }

  // Helper to extract monthly sales data for the chart
  private getMonthlySalesData(orders: Order[]) {
    const monthlySales: { [key: string]: number } = {};
    orders.forEach(order => {
      if (order.createdAt && order.totalPrice) {
        const monthYear = new Date(order.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.totalPrice;
      }
    });
    const labels = Object.keys(monthlySales).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = labels.map(label => monthlySales[label]);
    return { labels, data };
  }

  // Helper to extract category sales data for the chart
  private getCategorySalesData(orders: Order[], productMap: Map<string, { title: string, categoryName: string }>) {
    const categorySales: { [key: string]: number } = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.bookId && item.price && item.quantity) {
            const productInfo = productMap.get(item.bookId);
            const categoryName = productInfo ? productInfo.categoryName : 'Unknown Category';
            categorySales[categoryName] = (categorySales[categoryName] || 0) + item.price * item.quantity;
          }
        });
      }
    });
    const labels = Object.keys(categorySales);
    const data = labels.map(label => categorySales[label]);
    return { labels, data };
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Charts are now created after data is fetched in FetchData()
    }
  }

  createCharts(salesLabels: string[], salesData: number[], categoryLabels: string[], categoryData: number[]): void {
    if (this.salesTrendChartRef) {
      this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: salesLabels,
          datasets: [{
            label: 'Monthly Book Sales ($)',
            data: salesData,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `$${context.parsed.y.toLocaleString()} in sales`;
                }
              }
            }
          }
        }
      });
    }
    if (this.categorySalesChartRef) {
      this.categorySalesChart = new Chart(this.categorySalesChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: categoryLabels,
          datasets: [{
            label: 'Books Sold by Category',
            data: categoryData,
            backgroundColor: [
              'rgba(13, 110, 253, 0.7)',
              'rgba(25, 135, 84, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(111, 66, 193, 0.7)',
              'rgba(220, 53, 69, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.parsed.y} books sold`;
                }
              }
            }
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      if (this.salesTrendChart) {
        this.salesTrendChart.destroy();
      }
      if (this.categorySalesChart) {
        this.categorySalesChart.destroy();
      }
    }
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  getProgressBarClass(status: string): string {
    switch (status) {
      case 'On Track': return 'bg-success';
      case 'Delayed': return 'bg-warning';
      case 'Completed': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'On Track': return 'bg-success-light text-success';
      case 'Delayed': return 'bg-warning-light text-warning';
      case 'Completed': return 'bg-primary-light text-primary';
      default: return 'bg-secondary-light text-secondary';
    }
  }
}
