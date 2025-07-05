import { NewReview } from './../../interfaces/new-review';
import { Component, OnInit } from '@angular/core';
import { Products } from '../models/product.model';
import { ReviewService } from '../../services/review-service';
import { Review, ReviewResponse } from '../../interfaces/review';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../interfaces/product';
import { UserInfo } from '../../services/user-info';


@Component({
  selector: 'app-book-details',
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './book-details.html',
  standalone: true,
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {

  reviews: Review[] = [];
  noOfReviews:number=0;
  avgRate:number=0;
    bookId:String ='';

  newReview:NewReview ={
    userId:'',
    bookId:'',
    comment:'',
    rate:1
  }

  book:Product={ // initial data after then i will get it from db
      _id: "string",
      title: "string",
      slug: "string",
      author: "string",
      description: "string",
      imageCover: "string",
      images: [],
      price: 0,
      priceAfterDiscount: 0,
      quantity: 0,
      sold: 0,
      ratingQuantity: 0,
      category: {
        name: "string"
      },
      subcategory: [],
      createdAt: "string",
      updatedAt: "string",
  }
  constructor(
    private reviewserv:ReviewService,
    private route:ActivatedRoute,
    private productserv:ProductService,
    private userInfo:UserInfo
  ) {


  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = id;
      this.newReview.bookId = id;
      this.fetchBookReviews(id);
      this.fetchBookData(this.bookId);
    }
    this.newReview.userId = this.userInfo.getUserId();

  }
  fetchBookData(productId:String) {
    this.productserv.getProduct(productId).subscribe({
      next:(res)=>{
        this.book=res.data;
      },
      error:(err)=>{
        console.log(err);
      }

    })
  }

  fetchBookReviews(productId: String) { // get all reviews for a specific book
    this.reviewserv.getReviews(productId).subscribe({
      next:(reviews :ReviewResponse) => {
         this.reviews = reviews.comments;
         this.noOfReviews = reviews.count;
        this.avgRate = reviews.avgRate;

        console.log(this.reviews[7].userId.name);



      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }


  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + halfStar + emptyStars;
  }

  setRating(rating: number) {
    this.newReview.rate = rating;
  }

  submitReview(form: NgForm) {

    const reviewPayload:NewReview = { // posted at will be handled from backend
      comment: this.newReview.comment,
      rate: this.newReview.rate,
      userId: this.newReview.userId,
      bookId: this.newReview.bookId,
    };

    if (reviewPayload.rate && reviewPayload.comment) {

      console.log(reviewPayload);

      this.reviewserv.addReview(reviewPayload).subscribe({
        next:(res)=>{
          this.fetchBookReviews(reviewPayload.bookId);
          this.newReview.comment = '';
          this.newReview.rate = 0;
          form.resetForm();

        },
        error:(err)=>{
          console.error('Error fetching reviews:', err);
        }
      })
    }

  }
}



