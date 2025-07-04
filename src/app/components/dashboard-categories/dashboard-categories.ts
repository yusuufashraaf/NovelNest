import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import e from 'express';

interface Category{
  _id:string,
  name:string,
  slug:string,
  createdAt:string,
  updatedAt:string
}

@Component({
  selector: 'app-dashboard-categories',
  imports: [],
  templateUrl: './dashboard-categories.html',
  styleUrl: './dashboard-categories.css'
})
export class DashboardCategories {
allCategories: Category[] = [//list of all books in the store

  ];

  state:number = 0;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCategories(1,100)
  }

  isLoading = true;


  loadCategories(page: number,limit:number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit,
    };

    this.isLoading = false;
  }

  editCategory(bookId: string): void {
    this.changeState(2);
  }

  deleteCategory(bookId: string): void {
    this.allCategories = this.allCategories.filter(book => book._id !== bookId);
  }

  changeState(newState:number){
    if(this.state == newState)
      this.state = 0;
    else this.state = newState;
  }

  addCategory(){
    //Add Logic Here
  }

  updateCategory(){
    //Update Logic Here
  }
}
