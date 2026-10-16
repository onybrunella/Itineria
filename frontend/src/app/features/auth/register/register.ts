import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(private auth: Auth, private router:Router){}
    registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    pseudo:new FormControl('', [Validators.required])
  });

    onSubmit() {
    const email=this.registerForm.value.email;
    const password=this.registerForm.value.password;
    const pseudo=this.registerForm.value.pseudo;
    if (email && password && pseudo) {
      this.auth.register(email, password, pseudo).subscribe({
        next: (response) => {
          console.log("Register : INscription réussie!!", response);
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          console.log("Erreur d'inscription", err);
        }

      });
    }
  }

}
