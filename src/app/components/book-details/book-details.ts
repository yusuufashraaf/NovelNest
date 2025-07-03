import { Component } from '@angular/core';
import { Products } from '../models/product.model';

interface Review {
  _id: string,
  userId: string,
  bookId: string,
  postedAt: string,
  comment: string;
  rating: number,
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails {
  book: Products = {
    _id: '',
    title: 'Untitled Product',
    slug: 'untitled-product',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti esse nihil debitis aspernatur tempore eaque delectus omnis aliquid eos molestiae sunt aut est deleniti, aliquam reprehenderit maiores ipsa doloremque cum.',
    author: 'Unknown Author',
    quantity: 0,
    sold: 0,
    price: 100,
    priceAfterDiscount: 10,
    imageCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&h=600',
    images: [],
    subcategory: [],
    ratingAverage: 0,
    ratingQuantity: 0,
  };

 reviews: Review[] = [
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e1',
    userId: '64a1b2c3d4e5f6a7b8c9d0a1',
    bookId: '64a1b2c3d4e5f6a7b8c9d0b2',
    postedAt: '2023-06-15T14:30:22Z',
    comment: 'This book completely changed my perspective on modern literature. The character development was exceptional and the plot twists kept me engaged until the very last page.',
    rating: 5
  },
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e2',
    userId: '64a1b2c3d4e5f6a7b8c9d0a2',
    bookId: '64a1b2c3d4e5f6a7b8c9d0b2',
    postedAt: '2023-06-20T09:15:10Z',
    comment: 'While the premise was interesting, I found the middle section dragged on too long. The ending was satisfying though, and the prose was beautiful throughout.',
    rating: 3
  },
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e3',
    userId: '64a1b2c3d4e5f6a7b8c9d0a3',
    bookId: '64a1b2c3d4e5f6a7b8c9d0b2',
    postedAt: '2023-06-25T18:45:33Z',
    comment: 'A masterpiece of contemporary fiction! The author weaves multiple storylines together seamlessly. I particularly enjoyed the historical references and how they connected to the modern narrative.',
    rating: 5
  }
];

  newReview : Review = {
    _id: '123',
    userId: '456',
    bookId: '789',
    postedAt: 'Current Date',
    comment: '',
    rating: 0
  };

  constructor() {
    this.fetchBookData();
    this.fetchBookReviews();
  }

  fetchBookData() {
    //get book data from the backend and assign this data to "book"
  }

  fetchBookReviews() {
    //get all reviews from the backend and assign this data to "reviews"
  }

  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + halfStar + emptyStars;
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  submitReview() {
    if (this.newReview.rating && this.newReview.comment) {
      //add form data to 'newReview' and store it in the database
    }
  }
}



