import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  loggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn.subscribe(
      status => this.loggedIn = status
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
  login() {
    this.router.navigate(["login"]);
  }
  logout() {
    this.authService.doLogout();
  }
  signup() {
    this.router.navigate(["register"]);
  }
}
