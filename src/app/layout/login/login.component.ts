import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signinForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      "email": new FormControl('', [Validators.required, Validators.email]),
      "password": new FormControl('', [Validators.required]),
    });
  }
  ngOnInit() {}
  loginUser(){
    if (this.signinForm.valid) {
      this.authService.signIn(this.signinForm.value);
  } else {
    // Mark all form controls as touched
    Object.values(this.signinForm.controls).forEach(control => control.markAsTouched());
  }
  }
  navigate(){
    this.router.navigate(['register'])
  }
}
