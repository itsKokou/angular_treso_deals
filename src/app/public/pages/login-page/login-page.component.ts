import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { LoginResponseDTO } from '../../../core/models/login/login-response-dto';
import { ResponseLoginResponseDTO } from '../../../core/models/login/response-login-response-dto';
import { Router } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {
  isPasswordVisible: boolean = false;
  loginReponse?: LoginResponseDTO;
  isLoading: boolean = false;
  private fb = inject(FormBuilder);

  form : FormGroup = this.fb.group({
    identifiant: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(4)]],
  });
  error: string =""

  get identifiant(){
    return this.form.controls['identifiant'] as FormControl;
  }

  get password(){
    return this.form.controls['password'] as FormControl;
  }

  constructor(
    private securityService: SecurityServiceImpl,
    private router: Router
  ){}

  ngOnInit(): void {
    initFlowbite();
  }
  
  togglePassword(passwordField: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordField.type = this.isPasswordVisible ? 'text' : 'password';
  }

  onSubmit(){
    localStorage.clear();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let data = this.form.getRawValue();
    this.securityService.login(data).subscribe((res: ResponseLoginResponseDTO) => {
      this.isLoading = false;
      if (res.statusCode==200) {
        this.error=""
        this.loginReponse = res.data;
        this.securityService.isAuthenticated = true;
        localStorage.setItem("token", res.data!.token!);
        localStorage.setItem("requesId", res.data!.verificationDTO!.requesId!.toString())
        this.router.navigateByUrl("/validation")
      } else {
        this.securityService.isAuthenticated = false;
        this.error="Identifiant ou mot de passe incorrect"
      }
    }, (err)=>{
      this.isLoading = false;
      this.error="Erreur lors de la connexion, veuillez réessayer !"
    });
  }
  
}
