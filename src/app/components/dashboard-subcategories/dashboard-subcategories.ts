import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SubcategoryService, Subcategory } from '../../services/subcategory.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-subcategories',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard-subcategories.html'
})
export class DashboardSubcategories {
  allSubcategories: Subcategory[] = [];
  state: number = 0;
  isLoading = false;
  errorMsg: string = '';
  successMsg: string = '';

  // Form fields
  formSubcategoryId: string = '';
  formSubcategoryName: string = '';
  formSubcategorySlug: string = '';
  formSubcategoryCategory: string = '';

  categories: Category[] = [];

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadSubcategories();
    this.loadCategories();
  }

  loadSubcategories() {
    this.isLoading = true;
    this.errorMsg = '';
    this.subcategoryService.getAll().subscribe({
      next: (subcategories) => {
        this.allSubcategories = subcategories;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err;
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: () => this.categories = []
    });
  }

  getCategoryName(catId: string): string {
    return this.categories.find(c => c._id === catId)?.name || catId;
  }

  editSubcategory(subId: string): void {
    const sub = this.allSubcategories.find(s => s._id === subId);
    if (sub) {
      this.formSubcategoryId = sub._id;
      this.formSubcategoryName = sub.name;
      this.formSubcategorySlug = sub.slug;
      this.formSubcategoryCategory = sub.category;
      this.changeState(2);
    }
  }

  deleteSubcategory(subId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.errorMsg = '';
        this.successMsg = '';
        this.subcategoryService.delete(subId).subscribe({
          next: () => {
            this.successMsg = 'Subcategory deleted successfully!';
            this.loadSubcategories();
          },
          error: (err) => {
            this.errorMsg = err;
            this.isLoading = false;
          }
        });
      }
    });
  }

  changeState(newState: number) {
    this.state = this.state === newState ? 0 : newState;
    this.errorMsg = '';
    this.successMsg = '';
    if (this.state === 1) {
      // Reset form for add
      this.formSubcategoryId = '';
      this.formSubcategoryName = '';
      this.formSubcategorySlug = '';
      this.formSubcategoryCategory = '';
    }
  }

  addSubcategory() {
    if (!this.formSubcategoryName || !this.formSubcategorySlug || !this.formSubcategoryCategory) {
      this.errorMsg = 'All fields are required.';
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.subcategoryService.add({ name: this.formSubcategoryName, slug: this.formSubcategorySlug, category: this.formSubcategoryCategory }).subscribe({
      next: (sub) => {
        this.successMsg = 'Subcategory added successfully!';
        this.loadSubcategories();
        this.changeState(0);
        Swal.fire('Success', 'Subcategory added successfully!', 'success');
      },
      error: (err) => {
        this.errorMsg = err;
        this.isLoading = false;
        Swal.fire('Error', err, 'error');
      }
    });
  }

  updateSubcategory() {
    if (!this.formSubcategoryId || !this.formSubcategoryName || !this.formSubcategorySlug || !this.formSubcategoryCategory) {
      this.errorMsg = 'All fields are required.';
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.subcategoryService.update(this.formSubcategoryId, { name: this.formSubcategoryName, slug: this.formSubcategorySlug, category: this.formSubcategoryCategory }).subscribe({
      next: (sub) => {
        this.successMsg = 'Subcategory updated successfully!';
        this.loadSubcategories();
        this.changeState(0);
      },
      error: (err) => {
        this.errorMsg = err;
        this.isLoading = false;
        Swal.fire('Error', err, 'error');
      }
    });
  }
}
