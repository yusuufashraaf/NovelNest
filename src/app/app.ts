import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Search } from './shared/components/search/search';

@Component({
  selector: 'app-root',
  imports: [Navbar, Search, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'NovelNest';
}
