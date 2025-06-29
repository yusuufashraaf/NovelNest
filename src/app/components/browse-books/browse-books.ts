import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class BrowseBooks implements OnInit {
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
  publicationDates = ['2020s', '2010s', '2000s', '1990s', 'Classic'];

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

  booksPerPage = 8;
  currentPage = 1;
  totalPages = 1;
  visibleBooks: any[] = [];

  ngOnInit() {
    this.totalPages = Math.ceil(this.books.length / this.booksPerPage);
    this.updateVisibleBooks();
  }

  updateVisibleBooks() {
    const start = (this.currentPage - 1) * this.booksPerPage;
    const end = start + this.booksPerPage;
    this.visibleBooks = this.books.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateVisibleBooks();
  }
}
