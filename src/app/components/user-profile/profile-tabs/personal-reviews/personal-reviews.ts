import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Review {
  bookTitle: string;
  author: string;
  bookImage: string;
  reviewText: string;
  rating: number;
  editing: boolean;
}

@Component({
  selector: 'app-personal-reviews',
  imports: [FormsModule],
  templateUrl: './personal-reviews.html',
  styleUrl: './personal-reviews.css',
})
export class PersonalReviews {
  reviews = [
    {
      bookTitle: 'The Secret Garden',
      author: 'Anya Petrova',
      bookImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      reviewText: 'A captivating tale of mystery and self-discovery...',
      rating: 4,
      editing: false,
    },
    {
      bookTitle: 'The Silent Observer',
      author: 'Leo Maxwell',
      bookImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      reviewText: 'An intriguing thriller with a unique premise...',
      rating: 3,
      editing: false,
    },
    {
      bookTitle: 'Echoes of the Past',
      author: 'Clara Bennett',
      bookImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      reviewText: 'A beautifully written historical fiction...',
      rating: 5,
      editing: false,
    },
  ];
  toggleEdit(review: Review) {
    review.editing = !review.editing;
  }

  deleteReview(review: Review) {
    this.reviews = this.reviews.filter((r) => r !== review);
  }

  setRating(review: Review, newRating: number) {
    review.rating = newRating;
  }
}
