import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  isPlatformBrowser,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AddToCart } from '../add-to-cart/add-to-cart';
import { AddToWishlist } from '../add-to-wishlist/add-to-wishlist';
import { Product } from '../../services/product.service';
import { Products } from '../models/product.model';
import { ReviewResponse } from '../../interfaces/review';
import { ReviewService } from '../../services/review-service';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [
    RouterModule,
    AddToCart,
    AddToWishlist,
    FormsModule,
    NgTemplateOutlet,
  ],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class BrowseBooks implements OnInit {
  books: Products[] = [];
  genres: { _id: string; name: string }[] = [];
  authors: string[] = ['All'];
  ratings = [5, 4, 3, 2, 1];

  filters = {
    genre: null as string | null,
    author: null as string | null,
    rating: null as number | null,
    priceRange: null as string | null,
    sort: null as string | null,
    keyword: null as string | null,
  };

  activeFilterLabels: string[] = [];

  booksPerPageOptions = [16, 24, 32, 52, 68];
  booksPerPage = 12;
  currentPage = 1;
  totalPages = 1;

  minPrice = 0;
  maxPrice = 30000;
  selectedMin = this.minPrice;
  selectedMax = this.maxPrice;

  isLoading = false;
  showScrollTop = false;
  sidebarVisible = true;
  isSmallScreen = false;

  constructor(
    private productService: Product,
    private route: ActivatedRoute,
    private router: Router,
    private reviewserv:ReviewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + halfStar + emptyStars;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    this.route.queryParams.subscribe((params) => {
      const keyword = (params['keyword'] ?? '').trim();
      this.filters.keyword = keyword || null;
      this.loadBooks(this.currentPage, keyword || '');
    });

    this.productService.getGenres().subscribe({
      next: (res) => {
        this.genres = [{ _id: 'All', name: 'All' }, ...res.genres];
      },
    });

    this.productService.getAuthors().subscribe({
      next: (res) => {
        this.authors = ['All', ...res.authors];
      },
      error: (err) => console.error('Failed to load authors:', err),
    });
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth < 768;
      this.sidebarVisible = !this.isSmallScreen;
    }
  }

  private closeSidebarOnMobile() {
    if (this.isSmallScreen) {
      this.sidebarVisible = false;
    }
  }

  toggleFilters() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  loadBooks(page: number, keyword?: string) {
    this.isLoading = true;
    const { genre, author, rating, sort } = this.filters;

    const params: any = {
      page,
      limit: this.booksPerPage,
      'price[gte]': this.selectedMin,
      'price[lte]': this.selectedMax,
    };

    if (genre) params.category = genre;
    if (author) params.author = author;
    if (rating) params.rating = rating;
    if (sort) params.sort = sort;
    if (keyword) params.keyword = keyword;

    this.productService.getAllProducts(params).subscribe({
      next: (res) => {
        this.books = res.data || [];
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
        this.updateActiveFilters();
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
  updateActiveFilters() {
    const labels: string[] = [];

    if (this.filters.genre) {
      const genreObj = this.genres.find((g) => g._id === this.filters.genre);
      if (genreObj?.name !== 'All') labels.push(`Genre: ${genreObj!.name}`);
    }

    if (this.filters.author && this.filters.author !== 'All') {
      labels.push(`Author: ${this.filters.author}`);
    }

    if (this.filters.rating) {
      labels.push(`Rating: ${this.filters.rating}+`);
    }

    if (this.filters.priceRange) {
      labels.push(`Price: ${this.filters.priceRange}`);
    } else {
      labels.push(`Price: ${this.selectedMin} L.E - ${this.selectedMax} L.E`);
    }

    const sortLabels: { [key: string]: string } = {
      price: 'Price: Low to High',
      '-price': 'Price: High to Low',
      createdAt: 'Oldest First',
      '-createdAt': 'Newest First',
      rating: 'Top Rated',
      '-rating': 'Low Rated',
      title: 'Title: A-Z',
      '-title': 'Title: Z-A',
    };

    if (this.filters.sort && sortLabels[this.filters.sort]) {
      labels.push(`Sorted: ${sortLabels[this.filters.sort]}`);
    }

    if (this.filters.keyword?.trim()) {
      labels.push(`Search: ${this.filters.keyword.trim()}`);
    }

    this.activeFilterLabels = labels;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.loadBooks(page, this.filters.keyword || '');

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  setBooksPerPage(count: number) {
    this.booksPerPage = count;
    this.currentPage = 1;
    this.loadBooks(this.currentPage);
  }

  resetPageAndLoad() {
    this.currentPage = 1;
    this.closeSidebarOnMobile();
    this.loadBooks(this.currentPage, this.filters.keyword || '');
  }

  resetFilters() {
    this.filters = {
      genre: null,
      author: null,
      rating: null,
      priceRange: null,
      sort: null,
      keyword: null,
    };
    this.selectedMin = this.minPrice;
    this.selectedMax = this.maxPrice;
    this.resetPageAndLoad();
  }

  filterByGenre(genreId: string | null) {
    this.filters.genre = genreId === 'All' ? null : genreId;
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

  setSort(sortValue: string) {
    this.filters.sort = sortValue;
    this.resetPageAndLoad();
  }

  applyPriceRange() {
    this.filters.priceRange = null;
    this.resetPageAndLoad();
  }

  onKeywordChange(value: string) {
    const trimmed = value.trim();
    const wasSet = this.filters.keyword;
    this.filters.keyword = trimmed || null;

    if (!trimmed && wasSet) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { keyword: null },
        queryParamsHandling: 'merge',
      });
      this.loadBooks(this.currentPage);
      this.updateActiveFilters();
    }
  }

  searchBooks() {
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: this.filters.keyword || null },
      queryParamsHandling: 'merge',
    });
    this.loadBooks(this.currentPage, this.filters.keyword || '');
  }

  clearSearch() {
    this.filters.keyword = null;
    this.searchBooks();
    this.updateActiveFilters();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) this.setSort(select.value);
  }

  onPriceSliderChange() {
    if (this.selectedMin > this.selectedMax) {
      [this.selectedMin, this.selectedMax] = [
        this.selectedMax,
        this.selectedMin,
      ];
    }
  }

  goToProduct(productId: string) {
    this.router.navigate(['/Browse', productId]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollTop = window.scrollY > 300;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  closeMobileFilter() {
    const sidebar = document.getElementById('filterSidebar');
    if (sidebar && window.innerWidth < 768) {
      sidebar.classList.remove('show');
    }
  }
}
