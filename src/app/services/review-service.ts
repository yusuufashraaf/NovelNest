import { UserInfo } from './user-info';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Review, ReviewResponse } from '../interfaces/review';
import { Observable } from 'rxjs';
import { NewReview } from '../interfaces/new-review';
@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private userInfo: UserInfo
  ) {}

  addReview(body: NewReview): Observable<Review> {
    return this.http.post<Review>(
      'http://localhost:5000/api/v1/comment/create',
      body
    );
  }
  getReviews(Productid: String): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(
      `http://localhost:5000/api/v1/comment/${Productid}`
    );
  }
  deleteReview(reviewId: String): Observable<Review> {
    const headers = new HttpHeaders({
      Authorization: `${this.userInfo.getToken()}`,
    });
    return this.http.delete<Review>(
      `http://localhost:5000/api/v1/comment/${reviewId}`,
      { headers }
    );
  }

  // comment.service.ts
  getUserComments(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:5000/api/v1/comment/user/${userId}`
    );
  }

  updateReview(
    reviewId: string,
    body: { comment: string; rate: number }
  ): Observable<Review> {
    const headers = new HttpHeaders({
      Authorization: `${this.userInfo.getToken()}`,
    });
    return this.http.put<Review>(
      `http://localhost:5000/api/v1/comment/${reviewId}`,
      body,
      { headers }
    );
  }





}
