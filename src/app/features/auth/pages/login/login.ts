import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: any;
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private toaster: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const { username, password } = this.loginForm.value;
    if (this.auth.login(username!, password!)) {
      this.router.navigate(['/home']);
    } else {
      this.toaster.error('Invalid username or password');
    }
  }
}
