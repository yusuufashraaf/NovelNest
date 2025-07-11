import { UserInfo } from './../../services/user-info';
import { PaymentService } from './../../services/payment-service';
import { HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface book {
  book:String,
  quantity:number,
  price:number
}

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule,CommonModule],
  standalone:true,
  templateUrl: './check-out.html',
  styleUrl: './check-out.css'
})
export class CheckOut  implements OnInit {


  constructor(private paymentServ:PaymentService,
    private cart:CartService,
    private userInfo:UserInfo,
    private router:Router
  ){}

  cartItems:any;
  totalPrice:number=0;
  books:book[] = [];
  loading:boolean = false;


  ngOnInit(): void {

    this.cartItems= this.cart.cart().cartItems;
    this.totalPrice =this.cart.cart().totalPrice;
    this.books = this.cartItems.map((item:any) => ({
      book: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
       console.log(this.userInfo.getToken());

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


  isFormValid(): boolean {
    return this.checkoutForm.valid;
  }


  private markAllFieldsAsTouched(): void {
    this.checkoutForm.markAllAsTouched();
  }


  resetForm(): void {
    this.checkoutForm.reset();
  }


  selectPayment(method: string): void {
    this.checkoutForm.patchValue({ payment: method });
    console.log('Payment method selected:', method);
  }


  confirmPurchase(): void {
    if (this.isFormValid()) {
      this.createOrder();
    } else {
      console.log('Please fill all required fields correctly');
      this.markAllFieldsAsTouched();
    }
  }


  createOrder(): void {

      if (!this.books || this.books.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Your cart is empty',
          text: 'Please add books to your cart before proceeding to checkout.',
          confirmButtonText: 'Okay'
        });
        return;
      }

    if (this.loading || this.checkoutForm.invalid){
      this.markAllFieldsAsTouched();
      return;
    }
      this.loading = true;


    const formValues = this.checkoutForm.value;

    const finalOrder = {

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
        this.loading = false;


          const popup = window.open(res.data.approvalUrl, '_blank', 'width=600,height=800');

          window.addEventListener('message', (event) => {
            if (event.data?.paymentSuccess) {
              const { token, payerId } = event.data;
              this.paymentServ.setTokenPayerIdPaypal(token,payerId);
              popup?.close();

              this.router.navigate(['success']);
            }
          });

          if (!popup) {
            console.error('Popup was blocked by the browser.');
            Swal.fire({
              title: 'Popup Blocked!',
              text: 'Your browser has blocked the payment window. Please allow popups or try again.',
              icon: 'warning',
              confirmButtonText: 'OK',
              footer: '<a href="https://support.google.com/chrome/answer/95472" target="_blank">How to allow popups?</a>'
            });
          } else {
            popup.focus();
          }
      } else {
        this.loading = false;
        console.error('Payment initiation failed or approvalUrl missing.');
      }
    },
    error: (err) => {
      console.error('Error during payment initiation:', err);
            const errorMessage =
          err?.error?.message || 'An unexpected error occurred. Please try again.';

        Swal.fire({
          title: 'Payment Failed',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });

        this.loading = false;
    }
  });


  }
}
