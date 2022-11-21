import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";
import { JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Api url from environment.ts
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  public login(user: User): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${ this.host }/user/login`, user, {observe: 'response'});
  }

  // Register user, return user object
  public register(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>(`${ this.host }/user/register`, user);
  }

  public logOut(): void {
    this.token = null; // Clear token
    this.loggedInUsername = null; // Clear username
    localStorage.removeItem('user'); // Remove token from local storage
    localStorage.removeItem('token'); // Remove username from local storage
    localStorage.removeItem('users'); // Remove users from local storage
  }

  public saveToken(token: string): void {
    this.token = token; // Save token
    localStorage.setItem('token', token); // Save token to local storage
  }

  public addUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user)); // Save user to local storage
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user')); // Get user from local storage
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token'); // Get token from local storage
  }

  public getToken(): string {
    return this.token; // Return token
  }


  // @ts-ignore
  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      // Check if token is expired
      if ( this.jwtHelper.decodeToken(this.token).sub != null) {
        if(!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }

  }
}
