import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-categories',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard-categories.html',
  styleUrl: './dashboard-categories.css'
})
export class DashboardCategories {
  allCategories: Category[] = [];
  state: number = 0;
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 100;
  totalPages = 1;
  totalItems = 0;

  // Form fields
  formCategoryId: string = '';
  formCategoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCategories();
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  loadAllCategories() {
    console.log('Loading all categories to get total count');
    this.categoryService.getAllWithoutPagination().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.totalItems = res.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        } else if (res && Array.isArray(res.data)) {
          this.totalItems = res.data.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        }
        // Now load the first page
        this.loadCategories(1);
      },
      error: (err) => {
        this.loadCategories(1);
      }
    });
  }

  loadCategories(page = 1) {
    console.log('Loading categories for page:', page);
    this.isLoading = true;
    this.categoryService.getAll(page, this.pageSize).subscribe({
      next: (res: any) => {
        this.allCategories = res.data;

        // Handle different possible response structures
        if (res && typeof res === 'object') {
          // Check if response has data property
          if (res.data && Array.isArray(res.data)) {
            this.allCategories = res.data;
          } else if (Array.isArray(res)) {
            // If response is directly an array
            this.allCategories = res;
          }

          // Handle total count
          if (res.total !== undefined) {
            this.totalItems = res.total;
          } else if (res.count !== undefined) {
            this.totalItems = res.count;
          } else if (res.totalItems !== undefined) {
            this.totalItems = res.totalItems;
          } else {
            // If no total provided, use the length of data
            this.totalItems = this.allCategories.length;
          }

          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.currentPage = page;
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
        this.isLoading = false;
      }
    });
  }

  editCategory(catId: string): void {
    const cat = this.allCategories.find(c => c._id === catId);
    if (cat) {
      this.formCategoryId = cat._id;
      this.formCategoryName = cat.name;
      this.changeState(2);
    }
  }

  deleteCategory(catId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.categoryService.delete(catId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Category deleted successfully!', 'success');
            this.loadAllCategories(); // Reload all to get updated total
          },
          error: (err) => {
            Swal.fire('Error', err, 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  changeState(newState: number) {
    this.state = this.state === newState ? 0 : newState;
    if (this.state === 1) {
      // Reset form for add
      this.formCategoryId = '';
      this.formCategoryName = '';
    }
  }

  addCategory() {
    if (!this.formCategoryName ) {
      Swal.fire('Error', 'The name is required.', 'error');
      return;
    }
    this.isLoading = true;
    const slug = this.generateSlug(this.formCategoryName);
    this.categoryService.add({
      name: this.formCategoryName,
      slug
    }).subscribe({
      next: (cat) => {
        Swal.fire('Success', 'Category added successfully!', 'success');
        this.loadAllCategories(); // Reload all to get updated total
        this.changeState(0);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
        this.isLoading = false;
      }
    });
  }

  updateCategory() {
    if (!this.formCategoryId || !this.formCategoryName) {
      Swal.fire('Error', 'The name is required.', 'error');
      return;
    }
    this.isLoading = true;
    const slug = this.generateSlug(this.formCategoryName);
    this.categoryService.update(this.formCategoryId, { name: this.formCategoryName, slug }).subscribe({
      next: (cat) => {
        Swal.fire('Success', 'Category updated successfully!', 'success');
        this.loadAllCategories(); // Reload all to get updated total
        this.changeState(0);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.loadCategories(page);
  }
}
