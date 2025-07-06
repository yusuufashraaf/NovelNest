import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../services/review-service';
import { AuthService } from '../../../../services/auth.service';

interface Review {
  id: string;
  bookTitle: string;
  author: string;
  bookImage: string;
  reviewText: string;
  rating: number;
  postedAt: Date;
  editing: boolean;
}

@Component({
  selector: 'app-personal-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-reviews.html',
  styleUrls: ['./personal-reviews.css'],
})
export class PersonalReviews implements OnInit {
  reviews: Review[] = [];

  constructor(
    private commentService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        const userId = user?._id;

        if (!userId) {
          console.error('User not logged in or no ID found');
          return;
        }

        this.commentService.getUserComments(userId).subscribe({
          next: (data) => {
            console.log(data);
            
            this.reviews = data.map((comment: any) => ({
              id: comment._id,
              bookTitle: comment.bookId.title,
              author: comment.bookId.author || 'Unknown',
              bookImage: comment.bookId?.imageCover ,
              reviewText: comment.comment,
              rating: comment.rate,
              postedAt: comment.postedAt,
              editing: false,
            }));
          },
          error: (err) => console.error('Failed to load user comments:', err),
        });
      },
      error: (err) => {
        console.error('Failed to get user from auth service:', err);
      },
    });
  }

  setRating(review: Review, newRating: number): void {
    review.rating = newRating;
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
