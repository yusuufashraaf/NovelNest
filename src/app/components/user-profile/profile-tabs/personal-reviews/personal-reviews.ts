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
  saving?: boolean;
  deleting?: boolean;
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
  loading = true;

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
          this.loading = false;
          return;
        }

        this.commentService.getUserComments(userId).subscribe({
          next: (data) => {
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
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to load user comments:', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to get user from auth service:', err);
        this.loading = false;
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
        review.deleting = true;

        this.commentService.deleteReview(review.id).subscribe({
          next: () => {
            this.reviews = this.reviews.filter((r) => r.id !== review.id);
            Swal.fire('Deleted!', 'The review has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Failed to delete review:', err);
            Swal.fire('Error', 'Failed to delete the review.', 'error');
          },
          complete: () => {
            review.deleting = false;
          },
        });
      }
    });
  }

  toggleEdit(review: Review): void {
    if (review.editing) {
      review.saving = true;

      const payload = {
        comment: review.reviewText,
        rate: review.rating,
      };

      this.commentService.updateReview(review.id, payload).subscribe({
        next: () => {
          review.editing = false;
          review.saving = false;
        },
        error: (err) => {
          console.error('Failed to update review:', err);
          review.saving = false;
        },
      });
    } else {
      review.editing = true;
    }
  }
}
