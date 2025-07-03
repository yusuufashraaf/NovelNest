import { Component } from "@angular/core";
import { DashboardMain } from "../dashboard-main/dashboard-main";
import { DashboardProducts } from "../dashboard-products/dashboard-products";
import { DashboardUsers } from "../dashboard-users/dashboard-users";


export interface StoreMetric {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: number;
}

export interface CustomerActivity {
  id: number;
  customerName: string;
  booksPurchased: string[]; // Changed to array of strings
  date: string;
  avatar: string;
}

export interface StoreInitiative {
  name: string;
  completion: number;
  deadline: string;
  status: 'On Track' | 'Delayed' | 'Completed';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [DashboardMain, DashboardProducts, DashboardUsers]
})
export class Dashboard {
  
}