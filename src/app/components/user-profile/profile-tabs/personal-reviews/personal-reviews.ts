import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../services/review-service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
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
              bookImage: comment.bookId?.imageCover,
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

deleteReview(review: Review): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this review?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.commentService.deleteReview(review.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter((r) => r.id !== review.id);
          Swal.fire('Deleted!', 'The review has been deleted.', 'success');
        },
        error: (err) => {
          console.error('Failed to delete review:', err);
          Swal.fire('Error', 'Failed to delete the review.', 'error');
        },
      });
    }
  });
}


  toggleEdit(review: Review): void {
    if (review.editing) {
      const payload = {
        comment: review.reviewText,
        rate: review.rating,
      };
      this.commentService.updateReview(review.id, payload).subscribe({
        next: () => {
          review.editing = false;
        },
        error: (err) => {
          console.error('Failed to update review:', err);
        },
      });
    } else {
      review.editing = true;
    }
  }
}
