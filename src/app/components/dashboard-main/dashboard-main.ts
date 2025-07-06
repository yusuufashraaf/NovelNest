import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomerActivity, StoreInitiative, StoreMetric } from '../dashboard/dashboard';
import { Users, User } from '../../services/users';
import { Product } from '../../services/product.service';
import { OrderService, Order } from '../../services/order.service';
import { ChartService, DashboardChartData, ChartData } from '../../services/chart.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard-main',
  imports: [],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css'
})
export class DashboardMain implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef;
  @ViewChild('categorySalesChart') categorySalesChartRef!: ElementRef;

  storeMetrics: StoreMetric[] = [];

  recentCustomerActivities: CustomerActivity[] = [];

  storeInitiatives: StoreInitiative[] = [];

  salesTrendChart: any;
  categorySalesChart: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private http: HttpClient,
              private usersService: Users,
              private productService: Product,
              private orderService: OrderService,
              private chartService: ChartService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData() {

    // Use the new ChartService to get all chart data
    this.chartService.getDashboardChartData().subscribe({
      next: (chartData: DashboardChartData) => {

        // Update store metrics with real data
        this.updateStoreMetrics(chartData);

        // Create charts with real data
        this.createChartsWithData(chartData);

        // Update recent activities if orders are available
        this.updateRecentActivities(chartData.recentOrders);

      },
      error: (error) => {
        this.setDefaultValues();
      }
    });
  }

  private updateStoreMetrics(chartData: DashboardChartData) {
    // Get user count from the chart service data
    this.chartService.getUsersForCharts().subscribe(users => {
      const userCount = users.length;

      this.storeMetrics = [
        {
          title: 'Monthly Revenue',
          value: `$${chartData.totalRevenue.toLocaleString()}`,
          icon: 'bi bi-currency-dollar',
          color: 'bg-primary',
          change: 0
        },
        {
          title: 'New Customers',
          value: userCount.toLocaleString(),
          icon: 'bi bi-people',
          color: 'bg-success',
          change: 0
        },
        {
          title: 'New Books',
          value: '0', // Will be calculated from chart data
          icon: 'bi bi-book',
          color: 'bg-info',
          change: 0
        },
        {
          title: 'New Orders',
          value: chartData.totalOrders.toLocaleString(),
          icon: 'bi bi-cart',
          color: 'bg-warning',
          change: 0
        }
      ];

      // Use the real product count for New Books
      const totalBooks = chartData.monthlyProducts.data.reduce((sum, count) => sum + count, 0);
      this.storeMetrics[2].value = totalBooks.toLocaleString();

    });
  }

  private createChartsWithData(chartData: DashboardChartData) {
    // Destroy existing charts
    if (this.salesTrendChart) this.salesTrendChart.destroy();
    if (this.categorySalesChart) this.categorySalesChart.destroy();

    // Create new charts with real data
    this.createCharts(
      chartData.monthlyProducts.labels,
      chartData.monthlyProducts.data,
      chartData.categoryProducts.labels,
      chartData.categoryProducts.data
    );


  }

  private updateRecentActivities(recentOrders: any[]) {
    if (recentOrders && recentOrders.length > 0) {
      this.recentCustomerActivities = recentOrders.map((order, index) => ({
        id: order._id || `order-${index}`,
        customerName: order.userId || 'Unknown Customer',
        booksPurchased: order.items?.map((item: any) => item.bookId || 'Unknown Book') || ['Unknown Book'],
        date: new Date(order.createdAt).toLocaleDateString(),
        avatar: 'https://via.placeholder.com/48'
      }));
    } else {
      this.recentCustomerActivities = [];
    }
  }

  private setDefaultValues() {
    this.storeMetrics = [
      { title: 'Monthly Revenue', value: '$0', icon: 'bi bi-currency-dollar', color: 'bg-primary', change: 0 },
      { title: 'New Customers', value: '0', icon: 'bi bi-people', color: 'bg-success', change: 0 },
      { title: 'New Books', value: '0', icon: 'bi bi-book', color: 'bg-info', change: 0 },
      { title: 'New Orders', value: '0', icon: 'bi bi-cart', color: 'bg-warning', change: 0 }
    ];
    this.recentCustomerActivities = [];

    // Create empty charts
    this.createCharts([], [], [], []);
  }

  // Legacy method - keeping for backward compatibility
  async FetchData() {
    console.log('⚠️ Using legacy FetchData method - consider using loadDashboardData instead');
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Charts are now created after data is fetched in loadDashboardData()
    }
  }

  createCharts(salesLabels: string[], salesData: number[], categoryLabels: string[], categoryData: number[]): void {
    if (!this.isBrowser) return;
    if (this.salesTrendChartRef) {
      this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: salesLabels,
          datasets: [{
            label: 'New Books Added (Monthly)',
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
                  return `${context.parsed.y} new books added`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
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
            label: 'Books by Category',
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
                  return `${context.parsed.y} books in this category`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
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
