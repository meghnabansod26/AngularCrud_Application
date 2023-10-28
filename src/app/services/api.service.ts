import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIService {


  url="http://localhost:3000/registerEmployee";
  constructor(private http: HttpClient) { }

  postRegister(data:any)
  {
    return this.http.post<any>(this.url, data);
  }

  getRegister()

  {
  return this.http.get<any>(this.url);

  }

  
  putRegister(data:any,id:number){
    return this.http.put<any>("http://localhost:3000/registerEmployee/"+id,data);
   }


  
  deleteRegister(id:number)
  {
    return this.http.delete<any>(this.url+'/'+id)
  }}

