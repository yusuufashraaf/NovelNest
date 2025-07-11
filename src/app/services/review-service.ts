import { UserInfo } from './user-info';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Review, ReviewResponse } from '../interfaces/review';
import { Observable } from 'rxjs';
import { NewReview } from '../interfaces/new-review';
import { IsBoughtisReviewd } from '../interfaces/is-boughtis-reviewd';
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
    const token = this.userInfo.getToken() || localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.post<Review>(
      'http://localhost:5000/api/v1/comment/create',
      body,{headers}
    );
  }
  getReviews(Productid: String): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(
      `http://localhost:5000/api/v1/comment/${Productid}`
    );
  }
  deleteReview(reviewId: String): Observable<Review> {
    const token = this.userInfo.getToken() || localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `${token}`,
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
  getIsboughtandIsreviewed(bookId:string): Observable<IsBoughtisReviewd>{
    const token = this.userInfo.getToken() || localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return this.http.get<IsBoughtisReviewd>(
      `http://localhost:5000/api/v1/comment/check/${bookId}`
    ,{headers}
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
