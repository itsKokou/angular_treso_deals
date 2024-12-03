import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { LoginResponseDTO } from '../../../core/models/login/login-response-dto';
import { ResponseLoginResponseDTO } from '../../../core/models/login/response-login-response-dto';
import { Router } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  isPasswordVisible: boolean = false;
  loginReponse?: LoginResponseDTO;
  isLoading: boolean = false;

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
    private fb: FormBuilder,
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
    this.isLoading = true;
    let data = this.form.getRawValue();
    this.securityService.login(data).subscribe((res: ResponseLoginResponseDTO) => {
      
      this.isLoading = false;
      if (res.statusCode==200) {
        this.error=""
        this.loginReponse = res.data;
        this.securityService.isAuthenticated = true;
        localStorage.setItem("token", res.data!.token!);
        localStorage.setItem("requesId", res.data!.initVerificationDTO!.requesId!.toString())
        this.router.navigateByUrl("/validation")
      } else {
        this.securityService.isAuthenticated = false;
        this.error="Identifiant ou mot de passe incorrect"
      }
    });
  }
  
}
