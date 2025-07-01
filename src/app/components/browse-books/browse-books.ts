import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product.service';
import { Products } from '../../models/product.model';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class BrowseBooks implements OnInit {
<<<<<<< Updated upstream
  genres = [
    'Fantasy',
    'Historical Fiction',
    'Science Fiction',
    'Romance',
    'Mystery',
  ];
  authors = [
    'Jane Austen',
    'George Orwell',
    'J.K. Rowling',
    'F. Scott Fitzgerald',
  ];
  ratings = [5, 4, 3, 2, 1];
  priceRanges = ['Under $10', '$10 - $20', '$20 - $30', 'Over $30'];

  filterByGenre(genre: string) {
    console.log('Filtering by genre:', genre);
    // Apply filtering logic here
  }

  filterByAuthor(author: string) {
    console.log('Filtering by author:', author);
    // Apply filtering logic here
  }

  filterByRating(rating: number) {
    console.log('Filtering by rating:', rating);
    // Apply filtering logic here
  }

  filterByPrice(range: string) {
    console.log('Filtering by price range:', range);
    // Apply filtering logic here
  }

  filterByDate(date: string) {
    console.log('Filtering by publication date:', date);
    // Apply filtering logic here
  }
  books = [
    {
      title: 'The Secret Garden',
      author: 'Frances Hodgson Burnett',
      image:
        'https://images.unsplash.com/photo-1551022378-7c8eeb7dfb2d?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      image:
        'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      image:
        'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: '1984',
      author: 'George Orwell',
      image:
        'https://images.unsplash.com/photo-1558888703-c9e8f5a127f0?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Moby-Dick',
      author: 'Herman Melville',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Jane Eyre',
      author: 'Charlotte Brontë',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      image:
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      image:
        'https://images.unsplash.com/photo-1534081333815-ae5019106621?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      image:
        'https://images.unsplash.com/photo-1590608897129-79da92c57b2e?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Little Women',
      author: 'Louisa May Alcott',
      image:
        'https://images.unsplash.com/photo-1589198586034-2ba3b2f4f1ec?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Crime and Punishment',
      author: 'Fyodor Dostoevsky',
      image:
        'https://images.unsplash.com/photo-1600508771741-9982642f5b43?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'War and Peace',
      author: 'Leo Tolstoy',
      image:
        'https://images.unsplash.com/photo-1600185365483-26d7aeb2e08e?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Brothers Karamazov',
      author: 'Fyodor Dostoevsky',
      image:
        'https://images.unsplash.com/photo-1584941344614-c7e6f5dcd4b3?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Odyssey',
      author: 'Homer',
      image:
        'https://images.unsplash.com/photo-1535909339361-9efb58f70e99?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Iliad',
      author: 'Homer',
      image:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      image:
        'https://images.unsplash.com/photo-1606312619284-b61d62bd2b15?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      image:
        'https://images.unsplash.com/photo-1612178998078-4e6c7f1aa9f5?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Dracula',
      author: 'Bram Stoker',
      image:
        'https://images.unsplash.com/photo-1624981650045-c38f56d1811f?auto=format&fit=crop&w=400&h=600',
    },
    {
      title: 'Frankenstein',
      author: 'Mary Shelley',
      image:
        'https://images.unsplash.com/photo-1589998059171-334b9f30e217?auto=format&fit=crop&w=400&h=600',
    },
  ];
=======
  constructor(private productService: Product) {}
>>>>>>> Stashed changes

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
