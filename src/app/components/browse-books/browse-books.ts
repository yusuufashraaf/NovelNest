import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product.service';
import { Products } from '../models/product.model';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class BrowseBooks implements OnInit {
  constructor(private productService: Product) {}

  books: Products[] = [];
  booksPerPage = 8;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  genres: string[] = ['All'];
  authors: string[] = ['All'];
  ratings = [5, 4, 3, 2, 1];
  priceRanges = ['All', 'Under 100', '100 - 200', '200 - 300', 'Over 300'];

  filters = {
    genre: null as string | null,
    author: null as string | null,
    rating: null as number | null,
    priceRange: null as string | null,
  };

  ngOnInit() {
    this.productService.getGenres().subscribe({
      next: (res) => {
        this.genres = ['All', ...res.genres];
      },
      error: (err) => console.error('Failed to load genres:', err),
    });

    this.productService.getAuthors().subscribe({
      next: (res) => {
        this.authors = ['All', ...res.authors];
      },
      error: (err) => console.error('Failed to load authors:', err),
    });

    this.loadBooks(this.currentPage);
  }

  loadBooks(page: number) {
    this.isLoading = true;
    const { genre, author, rating, priceRange } = this.filters;

    const params: any = {
      page,
      limit: this.booksPerPage,
    };

    if (genre) params.genre = genre;
    if (author) params.author = author;
    if (rating) params.rating = rating;

    if (priceRange && priceRange !== 'All') {
      const priceMap: Record<string, () => void> = {
        'Under 100': () => (params['price[lte]'] = 100),
        '100 - 200': () => {
          params['price[gte]'] = 100;
          params['price[lte]'] = 200;
        },
        '200 - 300': () => {
          params['price[gte]'] = 200;
          params['price[lte]'] = 300;
        },
        'Over 300': () => (params['price[gte]'] = 300),
      };
      priceMap[priceRange]?.();
    }

    this.productService.getAllProducts(params).subscribe({
      next: (res) => {
        this.books = res.data || [];
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.books = [];
          this.totalPages = 1;
        }
        this.isLoading = false;
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadBooks(page);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  filterByGenre(genre: string) {
    this.filters.genre = genre === 'All' ? null : genre;
    this.resetPageAndLoad();
  }

  filterByAuthor(author: string) {
    this.filters.author = author === 'All' ? null : author;
    this.resetPageAndLoad();
  }

  filterByRating(rating: number) {
    this.filters.rating = rating;
    this.resetPageAndLoad();
  }

  filterByPrice(range: string) {
    this.filters.priceRange = range;
    this.resetPageAndLoad();
  }

  resetFilters() {
    this.filters = {
      genre: null,
      author: null,
      rating: null,
      priceRange: null,
    };
    this.resetPageAndLoad();
  }

  private resetPageAndLoad() {
    this.currentPage = 1;
    this.loadBooks(this.currentPage);
  }
}