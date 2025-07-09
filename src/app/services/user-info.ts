
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfo {
  userId:string='';
  token:string='';
  constructor(){};

  setuserId(id:string){
    this.userId =id;
  }
  setToken(token:string){
    this.token=token;
  }
  getToken(){
    return this.token;
  }
  getUserId(){
    return this.userId;
  }
}
