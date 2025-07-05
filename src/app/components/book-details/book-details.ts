import { NewReview } from './../../interfaces/new-review';
import { Component, OnInit } from '@angular/core';
import { Products } from '../models/product.model';
import { ReviewService } from '../../services/review-service';
import { Review, ReviewResponse } from '../../interfaces/review';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../interfaces/product';


@Component({
  selector: 'app-book-details',
  imports:[CommonModule,FormsModule],
  templateUrl: './book-details.html',
  standalone: true,
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  // book: Products = {
  //   _id: '',
  //   title: 'Untitled Product',
  //   slug: 'untitled-product',
  //   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti esse nihil debitis aspernatur tempore eaque delectus omnis aliquid eos molestiae sunt aut est deleniti, aliquam reprehenderit maiores ipsa doloremque cum.',
  //   author: 'Unknown Author',
  //   quantity: 0,
  //   sold: 0,
  //   price: 100,
  //   priceAfterDiscount: 10,
  //   imageCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&h=600',
  //   images: [],
  //   subcategory: [],
  //   ratingAverage: 0,
  //   ratingQuantity: 0,
  // };

 reviews: Review[] = [];
 noOfReviews:number=0;
 avgRate:number=0;
  bookId:String ='';
  newReview:NewReview ={
    userId:"64fdb2e9f9e3e0a5a1b3c1d9",
    bookId:'',
    postedAt:Date.now(),
    comment:'',
    rate:1
  }

  book:Product={
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
  constructor(private reviewserv:ReviewService,private route:ActivatedRoute,private productserv:ProductService) {


  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = id;
      this.newReview.bookId = id;
      this.fetchBookReviews(id);
      this.fetchBookData(this.bookId);
    }

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

  fetchBookReviews(productId: String) {
    this.reviewserv.getReviews(productId).subscribe({
      next:(reviews :ReviewResponse) => {
         this.reviews = reviews.comments;
         this.noOfReviews = reviews.count;
        this.avgRate = reviews.avgRate;

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
    console.log("pressed");

    const reviewPayload:NewReview = {
      comment: this.newReview.comment,
      rate: this.newReview.rate,
      userId: this.newReview.userId,
      bookId: this.newReview.bookId,
      postedAt:Date.now()
    };

    if (reviewPayload.rate && reviewPayload.comment) {


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



