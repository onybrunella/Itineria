import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private auth: Auth, private router:Router){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const email=this.loginForm.value.email;
    const password=this.loginForm.value.password;
    if (email && password) {
      this.auth.login(email, password).subscribe({
        next: (response) => {
          console.log("Login : Connexion réussie!!", response);
          this.router.navigate(['/trips']);
        },
        error:(err)=>{
          console.log("Erreur de connexion", err);
        }

      });
    }
  }
}