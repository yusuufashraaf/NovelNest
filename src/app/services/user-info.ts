
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfo {
  userId:String='';
  token:String='';
  constructor(){};

  setuserId(id:String){
    this.userId =id;
  }
  setToken(token:String){
    this.token=token;
  }
  getToken(){
    return this.token;
  }
  getUserId(){
    return this.userId;
  }
}
