import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, this.strongPassword.bind(this)])
    })

    this.authService.getTheValue();

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/main']);
    }
  }

  // onLogin(form: NgForm) {
  //   if (form.valid) {
  //     this.authService.login(form.value.username);
  //     this.authService.saveUsernameValue(form.value.username);
  //     this.router.navigate(['/main']);
  //   }
  // }

  onSubmit(){
    console.log(this.loginForm);
  }

  strongPassword(control: FormControl): { [s: string]: boolean } | null {
    if(!control.value){
      return null;
    }

    const containsNumber = /\d/.test(control.value);
    const containsUpperCase = /[A-Z]/.test(control.value);
    const containsLowerCase = /[a-z]/.test(control.value);
    const containsCharacters = /[!@#?]/.test(control.value);

    const isStrongPassword = control.value.length >= 8 && containsNumber && containsUpperCase && containsLowerCase && containsCharacters;

    if(!isStrongPassword){
      return { 'weakPassword': true };
    }
    return null;
  }
}
