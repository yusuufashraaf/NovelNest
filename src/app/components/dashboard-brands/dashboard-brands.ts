import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { BrandService, Brand } from '../../services/brand.service';
import { Product } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-brands',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard-brands.html',
  styleUrl: './dashboard-brands.css'
})
export class DashboardBrands {
  allBrands: Brand[] = [];
  allProducts: any[] = [];
  state: number = 0;
  isLoading = false;
  errorMsg: string = '';
  successMsg: string = '';

  // Form fields
  formBrandId: string = '';
  formBrandName: string = '';
  formBrandSlug: string = '';
  formBrandProduct: string = '';

  constructor(
    private brandService: BrandService,
    private productService: Product,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadBrands();
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts({}).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.allProducts = res;
        } else if (res && Array.isArray(res.data)) {
          this.allProducts = res.data;
        } else {
          this.allProducts = [];
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.allProducts = [];
      }
    });
  }

  getProductName(productId: string): string {
    if (!productId) return 'N/A';

    // Try to find the product by ID
    const product = this.allProducts.find(p => p._id === productId);
    if (product) {
      // Return the product name (could be 'name', 'title', 'productName', etc.)
      return product.name || product.title || product.productName || productId;
    }

    // Try case-insensitive match
    const productLower = this.allProducts.find(p =>
      (p._id && p._id.toLowerCase() === productId.toLowerCase()) ||
      (p.name && p.name.toLowerCase() === productId.toLowerCase()) ||
      (p.title && p.title.toLowerCase() === productId.toLowerCase())
    );
    if (productLower) {
      return productLower.name || productLower.title || productLower.productName || productId;
    }

    // If no match found, return the ID
    return productId;
  }

  loadBrands() {
    this.isLoading = true;
    this.errorMsg = '';
    this.brandService.getAllWithoutPagination().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.allBrands = res;
        } else if (res && Array.isArray(res.data)) {
          this.allBrands = res.data;
        } else {
          this.allBrands = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err;
        this.isLoading = false;
      }
    });
  }

  editBrand(brandId: string): void {
    const brand = this.allBrands.find(b => b._id === brandId);
    if (brand) {
      this.formBrandId = brand._id;
      this.formBrandName = brand.name;
      this.formBrandSlug = brand.slug;
      this.formBrandProduct = brand.product;
      this.changeState(2);
    }
  }

  deleteBrand(brandId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.brandService.delete(brandId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Brand deleted successfully!', 'success');
            this.loadBrands();
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
    this.errorMsg = '';
    this.successMsg = '';
    if (this.state === 1) {
      // Reset form for add
      this.formBrandId = '';
      this.formBrandName = '';
      this.formBrandSlug = '';
      this.formBrandProduct = '';
    }
  }

  addBrand() {
    if (!this.formBrandName || !this.formBrandProduct) {
      Swal.fire('Error', 'Name and Product are required.', 'error');
      return;
    }
    this.isLoading = true;
    const slug = this.generateSlug(this.formBrandName);
    this.brandService.add({
      name: this.formBrandName,
      slug: slug,
      product: this.formBrandProduct
    }).subscribe({
      next: (brand) => {
        Swal.fire('Success', 'Brand added successfully!', 'success');
        this.loadBrands();
        this.changeState(0);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
        this.isLoading = false;
      }
    });
  }

  updateBrand() {
    if (!this.formBrandId || !this.formBrandName || !this.formBrandProduct) {
      Swal.fire('Error', 'Name and Product are required.', 'error');
      return;
    }
    this.isLoading = true;
    const slug = this.generateSlug(this.formBrandName);
    this.brandService.update(this.formBrandId, {
      name: this.formBrandName,
      slug: slug,
      product: this.formBrandProduct
    }).subscribe({
      next: (brand) => {
        Swal.fire('Success', 'Brand updated successfully!', 'success');
        this.loadBrands();
        this.changeState(0);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
        this.isLoading = false;
      }
    });
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
