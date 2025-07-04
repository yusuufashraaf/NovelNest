import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomerActivity, StoreInitiative, StoreMetric } from '../dashboard/dashboard';


@Component({
  selector: 'app-dashboard-main',
  imports: [],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css'
})
export class DashboardMain implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef;
  @ViewChild('categorySalesChart') categorySalesChartRef!: ElementRef;

  storeMetrics: StoreMetric[] = [//Generic Data
    {
      title: 'Monthly Reveniew',
      value: '$28,450',
      icon: 'bi bi-currency-dollar',
      color: 'bg-primary',
      change: 15
    },
    {
      title: 'New Customers',
      value: '842',
      icon: 'bi bi-people',
      color: 'bg-success',
      change: 22
    },
    {
      title: 'New Books',
      value: '3,156',
      icon: 'bi bi-book',
      color: 'bg-info',
      change: 18
    },
    {
      title: 'New Orders',
      value: '89',
      icon: 'bi bi-cart',
      color: 'bg-warning',
      change: -8
    }
  ];

  recentCustomerActivities: CustomerActivity[] = [//Last Customer Purchases
    {
      id: 1,
      customerName: 'Sarah Johnson',
      booksPurchased: ['The Midnight Library', 'Where the Crawdads Sing', 'The Silent Patient'],
      date: '15 mins ago',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    },
    {
      id: 2,
      customerName: 'Michael Chen',
      booksPurchased: ['Atomic Habits', 'Deep Work'],
      date: '32 mins ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      customerName: 'Emma Wilson',
      booksPurchased: ['Monthly Book Club Subscription'],
      date: '1 hour ago',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg'
    },
    {
      id: 4,
      customerName: 'David Rodriguez',
      booksPurchased: ['The Silent Patient'],
      date: '2 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      id: 5,
      customerName: 'Lisa Thompson',
      booksPurchased: ['Fairy Tale', 'The Institute'],
      date: '3 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
    }
  ];

  storeInitiatives: StoreInitiative[] = [//Store Upgrades (Optional)
    {
      name: 'Website Redesign',
      completion: 85,
      deadline: 'June 15, 2023',
      status: 'On Track'
    },
    {
      name: 'Mobile App Development',
      completion: 65,
      deadline: 'July 30, 2023',
      status: 'On Track'
    },
    {
      name: 'Summer Reading Campaign',
      completion: 45,
      deadline: 'May 30, 2023',
      status: 'Delayed'
    },
    {
      name: 'Inventory System Upgrade',
      completion: 100,
      deadline: 'April 5, 2023',
      status: 'Completed'
    }
  ];

  salesTrendChart: any;
  categorySalesChart: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.FetchData();
  }



  async FetchData() {

  }


  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.createCharts();
    }
  }

  

  createCharts(): void {
    if (this.salesTrendChartRef) {
      this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Monthly Book Sales ($)',
            data: [18500, 22000, 19800, 24500, 28450, 26500, 30100],
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
          labels: ['Fiction', 'Non-Fiction', 'Children', 'Sci-Fi', 'Mystery'],
          datasets: [{
            label: 'Books Sold by Category',
            data: [1250, 980, 750, 620, 550],
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