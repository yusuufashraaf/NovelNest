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

  storeInitiatives: StoreInitiative[] = [
    {
      name: 'Website Redesign',
      completion: 75,
      deadline: '2023-12-15',
      status: 'On Track'
    },
    {
      name: 'Inventory System Upgrade',
      completion: 90,
      deadline: '2023-11-30',
      status: 'On Track'
    },
    {
      name: 'Mobile App Development',
      completion: 45,
      deadline: '2024-02-28',
      status: 'Delayed'
    },
    {
      name: 'Customer Loyalty Program',
      completion: 100,
      deadline: '2023-10-15',
      status: 'Completed'
    },
    {
      name: 'Store Expansion',
      completion: 30,
      deadline: '2024-06-30',
      status: 'Delayed'
    }
  ];

  salesTrendChart: any;
  categorySalesChart: any;



  allUsers: any[] = [];
  allOrders: Order[] = [];
  allProducts: any[] = [];
  totalReveniew: number = 0;
  chart1Data: any[] = [];

  constructor(
    private chartService: ChartService
  ) {

    chartService.getUsers().subscribe({
      next: (res: any) => {
        this.allUsers = res;
      }
    })

    chartService.getOrders().subscribe({
      next: (res: any) => {
        this.allOrders = res.data;
        this.calculateReveniew();
      }
    })

    chartService.getChart1().subscribe({
      next: (res: any) => {
        this.chart1Data = res.data;
        this.createCharts(this.allOrders,this.chart1Data);
      }
    })

    chartService.getProducts().subscribe({
      next: (res: any) => {
        this.allProducts = res.data;
        this.LoadstoreMetrics();
      }
    })

    

    //this.LoadstoreMetrics();
    
    //this.updateRecentActivities(chartData.recentOrders);
  }

  ngOnInit(): void {
    //this.loadDashboardData();

  }

  calculateReveniew() {
    this.totalReveniew = 0;
    this.allOrders.forEach(element => {
      this.totalReveniew += element.totalPrice;
    });
  }


  LoadstoreMetrics() {

    this.storeMetrics = [
      {
        title: 'Total Revenue',
        value: this.totalReveniew,
        icon: 'bi bi-currency-dollar',
        color: 'bg-primary',
        change: 0
      },
      {
        title: 'Number of Customers',
        value: this.allUsers.length,
        icon: 'bi bi-people',
        color: 'bg-success',
        change: 0
      },
      {
        title: 'Number of Books',
        value: this.allProducts.length, // Will be calculated from chart data
        icon: 'bi bi-book',
        color: 'bg-info',
        change: 0
      },
      {
        title: 'Number of Orders',
        value: this.allOrders.length,
        icon: 'bi bi-cart',
        color: 'bg-warning',
        change: 0
      }
    ];
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
    this.chartService.getDashboardChartData().subscribe(chartData => {
      const userCount = chartData.userCount;

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
    // this.createCharts(
    //   chartData.monthlyProducts.labels,
    //   chartData.monthlyProducts.data,
    //   chartData.categoryProducts.labels,
    //   //chartData.categoryProducts.data
    // );


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
    //this.createCharts([], [], [], []);
  }

  // Legacy method - keeping for backward compatibility
  async FetchData() {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
  }

  createCharts(salesLabels: Order[], categoryLabels: any[]): void {
    if (this.salesTrendChartRef) {
      this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: salesLabels.map(res => res.books),
          datasets: [{
            label: 'New Books Added (Monthly)',
            data: salesLabels.map(res => res.createdAt),
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
          labels: categoryLabels.map(res => res.categoryname),
          datasets: [{
            label: 'Sales By Category',
            data: categoryLabels.map(res => res.totalSold),
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
