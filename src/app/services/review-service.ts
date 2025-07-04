
import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Review } from '../interfaces/review';
import { Observable } from 'rxjs';
import { NewReview } from '../interfaces/new-review';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  constructor(private router:Router,private http:HttpClient){};


    addReview(body:NewReview):Observable<Review> {
    return this.http.post<Review>('http://localhost:5000/api/v1/comment/create', body);

    }
    getReviews(Productid:String): Observable<Review[]>{
        return this.http.get<Review[]>(`http://localhost:5000/api/v1/comment/${Productid}`);
    }
    deleteReview(reviewId:any) {
        return this.http.delete<any>(`http://localhost:5000/api/v1/comment/${reviewId}`);

    }
}






