import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch() {
    const trimmed = this.searchTerm.trim();
    if (trimmed) {
      this.router.navigate(['/Browse'], { queryParams: { keyword: trimmed } });
    }
  }
}
