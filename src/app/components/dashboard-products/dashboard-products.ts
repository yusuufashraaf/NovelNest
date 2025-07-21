import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../models/product.model';
import Swal from 'sweetalert2';
import { CategoryService, Category } from '../../services/category.service';
import {
  SubcategoryService,
  Subcategory,
} from '../../services/subcategory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-products.html',
  styleUrl: './dashboard-products.css',
})
export class DashboardProducts {
  booksInventory: Products[] = [];
  state: number = 0;

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  filteredSubcategories: Subcategory[] = [];
  formError: string = '';

  // Add form state
  selectedCategoryId: string = '';
  selectedSubcategoryId: string = '';
  // If you want to support multiple subcategories:
  // selectedSubcategoryIds: string[] = [];

  // Update form state
  selectedBookId: string = '';
  editBookName: string = '';
  editBookAuthor: string = '';
  editCategoryId: string = '';
  editSubcategoryId: string = '';
  editBookPrice: string = '';
  editBookQuantity: string = '';
  editBookDescription: string = '';
  editBookPriceAfterDiscount: string = '';

  // Add form state for all fields
  addTitle: string = '';
  addAuthor: string = '';
  addQuantity: string = '';
  addPrice: string = '';
  addPriceAfterDiscount: string = '';
  addDescription: string = '';

  // File handling properties
  addImageCoverFile: File | null = null;
  addImagesFiles: File[] = [];
  addPdfFile: File | null = null;
  addImageCoverPreview: string = '';
  addImagesPreview: string[] = [];

  editImageCoverFile: File | null = null;
  editImagesFiles: File[] = [];
  editPdfFile: File | null = null;
  editImageCoverPreview: string = '';
  editImagesPreview: string[] = [];

  isUploading = false;
  isLoading = true;

  // Add property to store current book being edited
  currentBook: Products | null = null;

  constructor(
    private productService: Product,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {
    this.loadBooks(1);
    this.loadCategoriesAndSubcategories();
  }

  loadCategoriesAndSubcategories() {
    this.categoryService.getAllWithoutPagination().subscribe({
      next: (res) => {
        this.categories = res || [];
        if (this.state === 2 && this.currentBook) {
          // Category
          if (
            typeof this.currentBook.category === 'object' &&
            this.currentBook.category !== null
          ) {
            this.editCategoryId = String(
              (this.currentBook.category as any)._id || ''
            );
          } else {
            this.editCategoryId = String(this.currentBook.category || '');
          }
        }
      },
      error: (err) => {
        this.formError = 'Failed to load categories.';
      },
    });

    this.subcategoryService.getAll().subscribe({
      next: (data) => {
        this.subcategories = data || [];
        if (this.state === 2 && this.currentBook) {
          // Subcategory
          if (
            Array.isArray(this.currentBook.subcategory) &&
            this.currentBook.subcategory.length > 0
          ) {
            if (
              typeof this.currentBook.subcategory[0] === 'object' &&
              this.currentBook.subcategory[0] !== null
            ) {
              this.editSubcategoryId = String(
                (this.currentBook.subcategory[0] as any)._id || ''
              );
            } else {
              this.editSubcategoryId = String(
                this.currentBook.subcategory[0] || ''
              );
            }
          } else if (
            typeof this.currentBook.subcategory === 'object' &&
            this.currentBook.subcategory !== null
          ) {
            this.editSubcategoryId = String(
              (this.currentBook.subcategory as any)._id || ''
            );
          } else {
            this.editSubcategoryId = String(this.currentBook.subcategory || '');
          }
        }
      },
      error: (err) => {
        this.formError = 'Failed to load subcategories.';
      },
    });
  }

  getCategoryName(category: string | { _id: string; name: string }): string {
    if (!category) return 'Unknown Category';
    if (typeof category === 'object' && category.name) return category.name;
    const found = this.categories.find((cat) => cat._id === category);
    return found ? found.name : 'Unknown Category';
  }

  getSubcategoryName(subcategoryId: string): string {
    // First try to find in filtered subcategories, then in all subcategories
    let sub = this.filteredSubcategories.find((s) => s._id === subcategoryId);
    if (!sub) {
      sub = this.subcategories.find((s) => s._id === subcategoryId);
    }
    return sub ? sub.name : 'Unknown Subcategory';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const originalSrc = img.src;

    // Log the failed image URL for debugging

    // Use a simple placeholder data URL instead of a file path
    img.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg1MFY1MEgyMFYyMFoiIGZpbGw9IiNEN0Q3RDciLz4KPHN2ZyB4PSIyNSIgeT0iMjUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI4IDI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTV2LTJoMTJ2MkgyMHptMC00di0yaDEydjJIMjB6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
  }

  // File handling methods for Add form
  onImageCoverChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.formError = 'Image file size must be less than 5MB';
        event.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.formError = 'Please select a valid image file';
        event.target.value = '';
        return;
      }

      this.addImageCoverFile = file;
      this.addImageCoverPreview = URL.createObjectURL(file);
      this.formError = '';
    }
  }

  onImagesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.addImagesFiles = [];
    this.addImagesPreview = [];

    files.forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.formError = 'Image file size must be less than 5MB';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.formError = 'Please select valid image files';
        return;
      }

      this.addImagesFiles.push(file);
      this.addImagesPreview.push(URL.createObjectURL(file));
    });

    if (this.formError) {
      event.target.value = '';
    }
  }

  onPdfChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        this.formError = 'PDF file size must be less than 50MB';
        event.target.value = '';
        return;
      }

      if (file.type !== 'application/pdf') {
        this.formError = 'Please select a valid PDF file';
        event.target.value = '';
        return;
      }

      this.addPdfFile = file;
      this.formError = '';
    }
  }

  // File handling methods for Edit form
  onEditImageCoverChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.formError = 'Image file size must be less than 5MB';
        event.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.formError = 'Please select a valid image file';
        event.target.value = '';
        return;
      }

      this.editImageCoverFile = file;
      this.editImageCoverPreview = URL.createObjectURL(file);
      this.formError = '';
    }
  }

  onEditImagesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.editImagesFiles = [];
    this.editImagesPreview = [];

    files.forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.formError = 'Image file size must be less than 5MB';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.formError = 'Please select valid image files';
        return;
      }

      this.editImagesFiles.push(file);
      this.editImagesPreview.push(URL.createObjectURL(file));
    });

    if (this.formError) {
      event.target.value = '';
    }
  }

  onEditPdfChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        this.formError = 'PDF file size must be less than 50MB';
        event.target.value = '';
        return;
      }

      if (file.type !== 'application/pdf') {
        this.formError = 'Please select a valid PDF file';
        event.target.value = '';
        return;
      }

      this.editPdfFile = file;
      this.formError = '';
    }
  }

  loadBooks(page: number) {
    this.isLoading = true;

    const params: any = {
      page,
      limit: 100,
    };

    this.productService.getAllProducts(params).subscribe({
      next: (res) => {
        this.booksInventory = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.booksInventory = [];
        }
        this.isLoading = false;
      },
    });
  }

  viewBook(bookId: string): void {
    Swal.fire(
      'Book Details',
      'View functionality will be implemented here',
      'info'
    );
  }

  editBook(bookId: string): void {
    this.currentBook =
      this.booksInventory.find((book) => book._id === bookId) || null;

    if (this.currentBook) {
      this.selectedBookId = bookId;
      this.editBookName = this.currentBook.title;
      this.editBookAuthor = this.currentBook.author;
      this.editBookQuantity = this.currentBook.quantity.toString();
      this.editBookPrice = this.currentBook.price.toString();
      this.editBookPriceAfterDiscount =
        this.currentBook.priceAfterDiscount?.toString() || '';
      this.editBookDescription = this.currentBook.description;
      // Robustly extract category _id
      if (
        typeof this.currentBook.category === 'object' &&
        this.currentBook.category !== null
      ) {
        this.editCategoryId = (this.currentBook.category as any)._id || '';
      } else {
        this.editCategoryId = this.currentBook.category || '';
      }
      // Robustly extract subcategory _id
      if (Array.isArray(this.currentBook.subcategory)) {
        if (this.currentBook.subcategory.length > 0) {
          if (
            typeof this.currentBook.subcategory[0] === 'object' &&
            this.currentBook.subcategory[0] !== null
          ) {
            this.editSubcategoryId =
              (this.currentBook.subcategory[0] as any)._id || '';
          } else {
            this.editSubcategoryId = this.currentBook.subcategory[0] || '';
          }
        } else {
          this.editSubcategoryId = '';
        }
      } else if (
        typeof this.currentBook.subcategory === 'object' &&
        this.currentBook.subcategory !== null
      ) {
        this.editSubcategoryId =
          (this.currentBook.subcategory as any)._id || '';
      } else {
        this.editSubcategoryId = this.currentBook.subcategory || '';
      }

      // Load filtered subcategories for the selected category
      if (this.editCategoryId) {
        this.onCategoryChange(this.editCategoryId, true);
      }
    }

    if (this.state == 2) {
      this.state = 0;
    } else {
      this.state = 2;
    }
  }

  deleteBook(bookId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.productService.deleteProduct(bookId).subscribe({
          next: (response: any) => {
            // Remove from local inventory
            this.booksInventory = this.booksInventory.filter(
              (book) => book._id !== bookId
            );
            Swal.fire('Deleted!', 'Book deleted successfully!', 'success');
            this.isLoading = false;
          },
          error: (error: any) => {
            Swal.fire(
              'Error',
              'Failed to delete book. Please try again.',
              'error'
            );
            this.isLoading = false;
          },
        });
      }
    });
  }

  canAddBook() {
    if (this.state == 1) this.state = 0;
    else this.state = 1;
  }

  validateAddForm() {
    this.formError = '';

    if (!this.addTitle?.trim()) {
      this.formError = 'Book title is required';
      return;
    }

    if (this.addTitle.length < 3) {
      this.formError = 'Title must be at least 3 characters long';
      return;
    }

    if (this.addTitle.length > 80) {
      this.formError = 'Title must be less than 80 characters';
      return;
    }

    if (!this.addAuthor?.trim()) {
      this.formError = 'Author name is required';
      return;
    }

    if (
      !this.addQuantity ||
      isNaN(parseInt(this.addQuantity)) ||
      parseInt(this.addQuantity) < 0
    ) {
      this.formError = 'Valid quantity is required';
      return;
    }

    if (
      !this.addPrice ||
      isNaN(parseFloat(this.addPrice)) ||
      parseFloat(this.addPrice) < 0
    ) {
      this.formError = 'Valid price is required';
      return;
    }

    if (parseFloat(this.addPrice) > 150000) {
      this.formError = 'Price cannot exceed 150,000';
      return;
    }

    if (
      this.addPriceAfterDiscount &&
      (isNaN(parseFloat(this.addPriceAfterDiscount)) ||
        parseFloat(this.addPriceAfterDiscount) < 0)
    ) {
      this.formError = 'Valid discount price is required';
      return;
    }

    if (!this.selectedCategoryId) {
      this.formError = 'Category is required';
      return;
    }

    if (!this.addImageCoverFile) {
      this.formError = 'Image cover file is required';
      return;
    }

    if (!this.addPdfFile) {
      this.formError = 'PDF file is required';
      return;
    }

    if (!this.addDescription?.trim()) {
      this.formError = 'Description is required';
      return;
    }

    if (this.addDescription.length < 20) {
      this.formError = 'Description must be at least 20 characters long';
      return;
    }
  }

  validateUpdateForm() {
    this.formError = '';

    if (!this.editBookName?.trim()) {
      this.formError = 'Book title is required';
      return;
    }

    if (this.editBookName.length < 3) {
      this.formError = 'Title must be at least 3 characters long';
      return;
    }

    if (this.editBookName.length > 80) {
      this.formError = 'Title must be less than 80 characters';
      return;
    }

    if (!this.editBookAuthor?.trim()) {
      this.formError = 'Author name is required';
      return;
    }

    if (
      !this.editBookQuantity ||
      isNaN(parseInt(this.editBookQuantity)) ||
      parseInt(this.editBookQuantity) < 0
    ) {
      this.formError = 'Valid quantity is required';
      return;
    }

    if (
      !this.editBookPrice ||
      isNaN(parseFloat(this.editBookPrice)) ||
      parseFloat(this.editBookPrice) < 0
    ) {
      this.formError = 'Valid price is required';
      return;
    }

    if (parseFloat(this.editBookPrice) > 150000) {
      this.formError = 'Price cannot exceed 150,000';
      return;
    }

    if (
      this.editBookPriceAfterDiscount &&
      (isNaN(parseFloat(this.editBookPriceAfterDiscount)) ||
        parseFloat(this.editBookPriceAfterDiscount) < 0)
    ) {
      this.formError = 'Valid discount price is required';
      return;
    }

    if (!this.editCategoryId) {
      this.formError = 'Category is required';
      return;
    }

    if (!this.editBookDescription?.trim()) {
      this.formError = 'Description is required';
      return;
    }

    if (this.editBookDescription.length < 20) {
      this.formError = 'Description must be at least 20 characters long';
      return;
    }
  }

  resetAddForm() {
    this.addTitle = '';
    this.addAuthor = '';
    this.addQuantity = '';
    this.addPrice = '';
    this.addPriceAfterDiscount = '';
    this.addDescription = '';
    this.selectedCategoryId = '';
    this.selectedSubcategoryId = '';
    this.filteredSubcategories = [];
    this.addImageCoverFile = null;
    this.addImagesFiles = [];
    this.addPdfFile = null;
    this.addImageCoverPreview = '';
    this.addImagesPreview = [];
    this.formError = '';
  }

  resetUpdateForm() {
    this.selectedBookId = '';
    this.editBookName = '';
    this.editBookAuthor = '';
    this.editCategoryId = '';
    this.editSubcategoryId = '';
    this.editBookPrice = '';
    this.editBookQuantity = '';
    this.editBookDescription = '';
    this.editBookPriceAfterDiscount = '';
    this.filteredSubcategories = [];
    this.editImageCoverFile = null;
    this.editImagesFiles = [];
    this.editPdfFile = null;
    this.editImageCoverPreview = '';
    this.editImagesPreview = [];
    this.currentBook = null;
    this.formError = '';
  }

  // Test method to debug API requirements
  async testAddBook() {
    try {
      // Create FormData - matching exactly what your backend expects
      const formData = new FormData();

      // Required fields (matching your Node.js validator)
      formData.append('title', 'Test Book');
      formData.append('description', 'This is a test book description');
      formData.append('author', 'Test Author');
      formData.append('quantity', '10'); // Must be numeric
      formData.append('price', '100.50'); // Must be numeric
      formData.append(
        'category',
        this.categories[0]?._id || '65d4a1b3a3b1f8a1c8e3b1f8'
      ); // Must be valid MongoID format

      // Optional fields
      formData.append('priceAfterDiscount', '80.25'); // Must be less than price if provided

      // Handle files properly (not as URLs)
      // Create mock files if needed
      const mockImageFile = new File([''], 'test-cover.jpg', {
        type: 'image/jpeg',
      });
      formData.append('imageCover', mockImageFile);

      const mockPdfFile = new File([''], 'test-book.pdf', {
        type: 'application/pdf',
      });
      formData.append('pdfLink', mockPdfFile);

      // Multiple images
      formData.append('images', mockImageFile);
      formData.append('images', mockImageFile);

      // Subcategory (must be array of MongoIDs if provided)
      // if (this.subcategories.length) {
      //     formData.append('subcategory', JSON.stringify([this.subcategories[1]._id]));
      // }

      // Send to backend
      const response = await lastValueFrom(
        this.productService.createProduct(formData)
      );

      Swal.fire('Test Success', 'Minimal product creation works!', 'success');
    } catch (error: any) {
      Swal.fire(
        'Test Failed',
        error.message || 'Product creation failed',
        'error'
      );
    }
  }

  async addBook() {
    // Frontend validation
    if (
      !this.addTitle ||
      !this.addDescription ||
      !this.addAuthor ||
      !this.addQuantity ||
      !this.addPrice ||
      !this.selectedCategoryId
    ) {
      this.formError = 'Please fill all required fields';
      Swal.fire('Error', this.formError, 'error');
      return;
    }

    if (
      this.addPriceAfterDiscount &&
      this.addPriceAfterDiscount >= this.addPrice
    ) {
      this.formError = 'Discounted price must be lower than regular price';
      Swal.fire('Error', this.formError, 'error');
      return;
    }

    this.isUploading = true;
    this.formError = '';

    try {
      const formData = new FormData();

      // Required fields
      formData.append('title', this.addTitle);
      formData.append('description', this.addDescription);
      formData.append('author', this.addAuthor);
      formData.append('quantity', this.addQuantity.toString());
      formData.append('price', this.addPrice.toString());
      formData.append('category', this.selectedCategoryId);

      // Optional fields
      if (this.addPriceAfterDiscount) {
        formData.append(
          'priceAfterDiscount',
          this.addPriceAfterDiscount.toString()
        );
      }

      // Handle subcategories (convert to array if single value)
      if (this.selectedSubcategoryId) {
        if (Array.isArray(this.selectedSubcategoryId)) {
          formData.append(
            'subcategory',
            JSON.stringify(this.selectedSubcategoryId)
          );
        } else {
          formData.append(
            'subcategory',
            JSON.stringify([this.selectedSubcategoryId])
          );
        }
      }

      // Files handling
      if (this.addImageCoverFile) {
        formData.append('imageCover', this.addImageCoverFile);
      }
      if (this.addPdfFile) {
        formData.append('pdfLink', this.addPdfFile);
      }

      // Multiple images
      if (this.addImagesFiles?.length) {
        this.addImagesFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      // Send to backend
      const response = await lastValueFrom(
        this.productService.createProduct(formData)
      );

      Swal.fire('Success', 'Book added successfully!', 'success');
      this.resetAddForm();
      this.loadBooks(1);
    } catch (error: any) {
      this.formError = error.message || 'Failed to add book';
      Swal.fire('Error', this.formError, 'error');
    } finally {
      this.isUploading = false;
    }
  }

  async updateBook() {
    this.validateUpdateForm();
    if (this.formError) {
      Swal.fire('Error', this.formError, 'error');
      return;
    }
    this.isUploading = true;
    this.formError = '';

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append text fields
      formData.append('title', this.editBookName);
      formData.append('description', this.editBookDescription);
      formData.append('author', this.editBookAuthor);
      formData.append('quantity', this.editBookQuantity.toString());
      formData.append('price', this.editBookPrice.toString());
      formData.append('category', this.editCategoryId);

      // Append optional fields
      if (
        this.editBookPriceAfterDiscount &&
        this.editBookPriceAfterDiscount.toString().trim()
      ) {
        formData.append(
          'priceAfterDiscount',
          this.editBookPriceAfterDiscount.toString()
        );
      }

      if (this.editSubcategoryId) {
        // The backend expects an array of subcategory IDs, so we send a JSON stringified array.
        formData.append(
          'subcategory',
          JSON.stringify([this.editSubcategoryId])
        );
      }

      // Handle image cover - use new file if uploaded, otherwise keep existing
      if (this.editImageCoverFile) {
        formData.append('imageCover', this.editImageCoverFile);
      } else if (this.currentBook?.imageCover) {
        formData.append('imageCover', this.currentBook.imageCover);
      }

      // Handle PDF - use new file if uploaded, otherwise keep existing
      if (this.editPdfFile) {
        formData.append('pdfLink', this.editPdfFile);
      } else if (this.currentBook?.pdfLink) {
        formData.append('pdfLink', this.currentBook.pdfLink);
      }

      // Handle additional images - use new files if uploaded, otherwise keep existing
      if (this.editImagesFiles.length > 0) {
        this.editImagesFiles.forEach((file) => {
          formData.append('images', file);
        });
      } else if (
        this.currentBook?.images &&
        this.currentBook.images.length > 0
      ) {
        this.currentBook.images.forEach((imageUrl) => {
          formData.append('images', imageUrl);
        });
      }

      // Send to backend
      const response = await this.productService
        .updateProduct(this.selectedBookId, formData)
        .toPromise();

      Swal.fire('Success', 'Book updated successfully!', 'success');
      this.resetUpdateForm();
      this.loadBooks(1);
      this.state = 0;
    } catch (error: any) {
      let errorMessage = 'Failed to update book';
      if (error.message) {
        errorMessage += ': ' + error.message;
      }

      this.formError = errorMessage;
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      this.isUploading = false;
    }
  }

  // Add method to handle category selection changes
  onCategoryChange(categoryId: string, isEditForm: boolean = false): void {
    if (!categoryId) {
      this.filteredSubcategories = [];
      if (isEditForm) {
        this.editSubcategoryId = '';
      } else {
        this.selectedSubcategoryId = '';
      }
      return;
    }

    this.subcategoryService.getByCategory(categoryId).subscribe({
      next: (subcategories) => {
        this.filteredSubcategories = subcategories;

        // Clear subcategory selection if current selection is not in filtered list
        if (isEditForm) {
          const isValidSelection = this.filteredSubcategories.some(
            (sub) => sub._id === this.editSubcategoryId
          );
          if (!isValidSelection) {
            this.editSubcategoryId = '';
          }
        } else {
          const isValidSelection = this.filteredSubcategories.some(
            (sub) => sub._id === this.selectedSubcategoryId
          );
          if (!isValidSelection) {
            this.selectedSubcategoryId = '';
          }
        }
      },
      error: (err) => {
        // Fallback: filter subcategories locally if backend endpoint doesn't exist
        this.filteredSubcategories = this.subcategories.filter(
          (sub) => sub.category === categoryId
        );

        // Clear subcategory selection if current selection is not in filtered list
        if (isEditForm) {
          const isValidSelection = this.filteredSubcategories.some(
            (sub) => sub._id === this.editSubcategoryId
          );
          if (!isValidSelection) {
            this.editSubcategoryId = '';
          }
        } else {
          const isValidSelection = this.filteredSubcategories.some(
            (sub) => sub._id === this.selectedSubcategoryId
          );
          if (!isValidSelection) {
            this.selectedSubcategoryId = '';
          }
        }
      },
    });
  }

  // Add method to handle add form category change
  onAddCategoryChange(): void {
    this.onCategoryChange(this.selectedCategoryId, false);
  }

  // Add method to handle edit form category change
  onEditCategoryChange(): void {
    this.onCategoryChange(this.editCategoryId, true);
  }
}
