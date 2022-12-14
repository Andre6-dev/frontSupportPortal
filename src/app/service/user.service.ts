import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";
import { JwtHelperService} from "@auth0/angular-jwt";
import { CustomHttpResponse } from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[] | HttpErrorResponse> {
    // Return an user array from the API
    return this.http.get<User[] | HttpErrorResponse>(`${ this.host }/user/list`);
  }

  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    // Return an user object from the API
    return this.http.post<User | HttpErrorResponse>(`${ this.host }/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    // Return an user object from the API
    return this.http.post<User | HttpErrorResponse>(`${ this.host }/user/update`, formData);
  }

  public resetPassword(email: string): Observable<HttpResponse<any> | HttpErrorResponse> {
    // Return an user object from the API
    return this.http.get<HttpResponse<any> | HttpErrorResponse>(`${ this.host }/user/reset-password/${ email }`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User | HttpErrorResponse>> {
    return this.http.post<User | HttpErrorResponse>(`${ this.host }/user/update-profile-image`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(userId: number): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.delete<CustomHttpResponse>(`${ this.host }/user/delete/${ userId }`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }

}


