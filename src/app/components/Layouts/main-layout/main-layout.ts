import { Component } from '@angular/core';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar,RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
