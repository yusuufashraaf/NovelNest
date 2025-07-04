import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getAllWithoutPagination() {
    throw new Error('Method not implemented.');
  }

  constructor(private router:Router,private http:HttpClient){};


 getProduct(Productid:String): Observable<any>{
        return this.http.get<any>(`http://localhost:5000/api/v1/products/${Productid}`);
    }
}
