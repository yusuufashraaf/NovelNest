import { PaymentService } from './../../services/payment-service';
import { HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule],
  standalone:true,
  templateUrl: './check-out.html',
  styleUrl: './check-out.css'
})
export class CheckOut {
  router: any;

  constructor(private paymentServ:PaymentService){}


userId = '664d75f285d1f2b4e7e4567a';

books = [
  {
    book: '665a1bc67f9911a3bfa1234c',
    quantity: 2,
    price: 19.99
  },
  {
    book: '665a1bc67f9911a3bfa1234d',
    quantity: 1,
    price: 29.99
  }
];

get totalPrice() {
  return this.books.reduce((acc, b) => acc + b.quantity * b.price, 0);
}

generateOrderNumber(): string {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0') +
    now.getMilliseconds().toString().padStart(3, '0');
  return `ORD-${timestamp}`;
}
checkoutForm= new FormGroup({
  firstName :new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50)
  ]),
  lastName : new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50)
  ]),
    address :new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100)
  ]),
    city : new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50)
  ]),
   state :new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50)
  ]),
    zipCode : new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{5}(-\d{4})?$/),
    Validators.minLength(5),
    Validators.maxLength(10)
  ]),
    cardNumber : new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{16}$/),
    Validators.minLength(16),
    Validators.maxLength(16)
  ]),
    expiry :new FormControl('', [
    Validators.required,
    Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
  ]),
    cvv :new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{3,4}$/),
    Validators.minLength(3),
    Validators.maxLength(4)
  ]),
  country: new FormControl('US', Validators.required),
  payment: new FormControl('paypal', Validators.required)

});



  // Getter methods for form controls
  get firstName() { return this.checkoutForm.get('firstName')!; }
  get lastName() { return this.checkoutForm.get('lastName')!; }
  get address() { return this.checkoutForm.get('address')!; }
  get city() { return this.checkoutForm.get('city')!; }
  get state() { return this.checkoutForm.get('state')!; }
  get zipCode() { return this.checkoutForm.get('zipCode')!; }
  get cardNumber() { return this.checkoutForm.get('cardNumber')!; }
  get expiry() { return this.checkoutForm.get('expiry')!; }
  get cvv() { return this.checkoutForm.get('cvv')!; }
  get country() { return this.checkoutForm.get('country')!; }
  get payment() { return this.checkoutForm.get('payment')!; }

  // Method to check if form is valid
  isFormValid(): boolean {
    return this.checkoutForm.valid;
  }

  // Helper method to mark all fields as touched
  private markAllFieldsAsTouched(): void {
    this.checkoutForm.markAllAsTouched();
  }

  // Method to reset form
  resetForm(): void {
    this.checkoutForm.reset();
  }

  // Payment method selection
  selectPayment(method: string): void {
    this.checkoutForm.patchValue({ payment: method });
    console.log('Payment method selected:', method);
  }

  // Confirm purchase method
  confirmPurchase(): void {
    if (this.isFormValid()) {
      this.createOrder();
    } else {
      console.log('Please fill all required fields correctly');
      this.markAllFieldsAsTouched();
    }
  }

  // Fixed createOrder method (renamed from createProduct)
  createOrder(): void {
    if (!this.isFormValid()) {
      this.markAllFieldsAsTouched();
      return;
    }

    const formValues = this.checkoutForm.value;

    const finalOrder = {
      user: this.userId,
      books: this.books,
      totalPrice: this.totalPrice,
      shippingAddress: {
        street: formValues.address,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        country: formValues.country,
      },
      paymentMethod: formValues.payment,
      orderNumber: this.generateOrderNumber(),
    };

    console.log('Final Order JSON:', finalOrder);
    this.paymentServ.initiatePayment(finalOrder).subscribe({
    next: (res) => {
      if (res?.success && res.data?.approvalUrl) {
        window.location.href = res.data.approvalUrl;
      } else {
        console.error('Payment initiation failed or approvalUrl missing.');
      }
    },
    error: (err) => {
      console.error('Error during payment initiation:', err);
      this.router.navigate(['/err']);
    }
  });


  }
}
