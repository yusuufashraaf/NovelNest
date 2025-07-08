import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddToCart } from '../add-to-cart/add-to-cart';
import { AddToWishlist } from '../add-to-wishlist/add-to-wishlist';
import { Product } from '../../services/product.service';
import { Products } from '../models/product.model';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [RouterModule, AddToCart, AddToWishlist],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class BrowseBooks implements OnInit {
  constructor(
    private productService: Product,
    private route: ActivatedRoute,

    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
    sort: null as string | null,
  };

  showScrollTop = false;
  sidebarVisible = true;
  isSmallScreen = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    this.route.queryParams.subscribe((params) => {
      const keyword = params['keyword'] || null;
      this.loadBooks(this.currentPage, keyword);
    });

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
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth < 768;
      this.sidebarVisible = !this.isSmallScreen;
    }
  }

  toggleFilters() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  private closeSidebarOnMobile() {
    if (this.isSmallScreen) {
      this.sidebarVisible = false;
    }
  }

  loadBooks(page: number, keyword?: string) {
    this.isLoading = true;
    const { genre, author, rating, priceRange, sort } = this.filters;

    const params: any = {
      page,
      limit: this.booksPerPage,
    };

    if (genre) params.genre = genre;
    if (author) params.author = author;
    if (rating) params.rating = rating;
    if (keyword) params.keyword = keyword;

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

    if (sort) {
      params.sort = sort;
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

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  filterByGenre(genre: string) {
    console.log(genre);

    this.filters.genre = genre === 'All' ? null : genre;
    this.resetPageAndLoad();
    this.closeSidebarOnMobile();
  }

  filterByAuthor(author: string) {
    this.filters.author = author === 'All' ? null : author;
    this.resetPageAndLoad();
    this.closeSidebarOnMobile();
  }

  filterByRating(rating: number) {
    this.filters.rating = rating;
    this.resetPageAndLoad();
    this.closeSidebarOnMobile();
  }

  filterByPrice(range: string) {
    this.filters.priceRange = range;
    this.resetPageAndLoad();
    this.closeSidebarOnMobile();
  }

  setSort(sortValue: string) {
    this.filters.sort = sortValue;
    this.resetPageAndLoad();
    this.closeSidebarOnMobile();
  }

  resetFilters() {
    this.filters = {
      genre: null,
      author: null,
      rating: null,
      priceRange: null,
      sort: null,
    };
    this.resetPageAndLoad();
  }

  private resetPageAndLoad() {
    this.currentPage = 1;
    this.closeSidebarOnMobile();
    this.loadBooks(this.currentPage);
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

  goToProduct(productId: string) {
    this.router.navigate(['/Browse', productId]);
  }


}
