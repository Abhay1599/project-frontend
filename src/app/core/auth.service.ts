// Import necessary Angular core, HTTP and RxJS functionalities.
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

// The @Injectable decorator marks the class as one that participates in the dependency injection system.
@Injectable({
  providedIn: "root", // Specifies that the service should be provided in the root injector.
})
export class AuthService {
  endpoint: string = "http://localhost:3000"; // Base URL for the API.
  headers = new HttpHeaders().set("Content-Type", "application/json"); // Default HTTP headers for requests.
  private authStatus = new BehaviorSubject<boolean>(false);
  
  // Constructor to inject dependencies.
  constructor(
    private http: HttpClient,          // HTTP client for making requests.
    public router: Router,             // Router to navigate between components.
    @Inject(PLATFORM_ID) private platformId: Object  // PLATFORM_ID to check the platform (browser or server).
  ) { this.checkInitialAuthStatus();}

  private checkInitialAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const authToken = localStorage.getItem("access_token");
      this.authStatus.next(authToken !== null);
    }
  }

  // Method for signing in a user.
  signIn(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/signin`, user)
      .subscribe((res: any) => {
        localStorage.setItem("access_token", res.token);  // Store the token in local storage.
        this.authStatus.next(true); // Update the auth status
        this.router.navigate(["dashboard"]);  // Navigate to dashboard on successful sign in.
      });
  }

  // Method for signing up a new user.
  signUp(signupObject: any) {
    const body = {
      email: signupObject.email,
      password: signupObject.password,
      name: signupObject.name,
    };
    return this.http
      .post<any>(`${this.endpoint}/signup`, body)
      .subscribe((res: any) => {
        localStorage.setItem("access_token", res.token); // Store the token in local storage.
        this.authStatus.next(true); // Update the auth status
        this.router.navigate(["dashboard"]); // Navigate to dashboard on successful sign up.
      });
  }

  // Method to retrieve the stored authentication token.
  getToken() {
    if (isPlatformBrowser(this.platformId)) {  // Check if running in a browser.
      return localStorage.getItem("access_token");
    }
    return null; // Return null if not in browser environment.
  }

  // Getter to check if user is logged in.
  get isLoggedIn() {
    return this.authStatus.asObservable();
  }

  // Method to log out the user.
  doLogout() {
    let removeToken = localStorage.removeItem("access_token"); // Remove the token from local storage.
    this.authStatus.next(false); // Update the auth status
    if (removeToken == null) {  // Check if token was successfully removed.
      this.router.navigate([""]); // Navigate to the home page.
    }
  }

  // Method to fetch movies with pagination and optional filters.
  getMovies(request: any): Observable<any> {
    const { first, rows, filter } = request;
    const page = Math.floor(first / rows) + 1;  // Calculate the page number.
    let params = new HttpParams()
      .set("page", page.toString())
      .set("perPage", rows.toString());  // Set pagination parameters.
    if (filter && filter.title) {
      params = params.set("title", filter.title);  // Add filter by title if provided.
    }
    let api = `${this.endpoint}/api/movies`;
    return this.http.get<any>(api, { headers: this.headers, params: params });  // Make the HTTP GET request.
  }

  // Method to handle errors from HTTP requests.
  handleError(error: HttpErrorResponse) {
    let msg = "";
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      msg = error.error.message;
    } else {
      // Server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);  // Return an Observable with a user-facing error message.
  }
}
