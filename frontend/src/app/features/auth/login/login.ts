import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private auth: Auth, private router:Router, private toast: Toast){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const email=this.loginForm.value.email;
    const password=this.loginForm.value.password;
    if (email && password) {
      this.auth.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/trips']);
        },
        error: () => {
          this.toast.error('Email ou mot de passe incorrect');
        }

      });
    }
  }
}