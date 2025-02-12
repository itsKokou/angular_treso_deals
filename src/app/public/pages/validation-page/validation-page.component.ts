import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { ResponseVerificationResponseDto } from '../../../core/models/validation/response-verification-response-dto';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-validation-page',
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './validation-page.component.html',
  styleUrl: './validation-page.component.css'
})
export class ValidationPageComponent {
  error : string = ""
  private fb = inject(FormBuilder);
  form : FormGroup = this.fb.group({});
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private securityService: SecurityServiceImpl
  ){}

  ngOnInit(): void {
    initFlowbite();
  }

  onKeyUp(actuelInput: HTMLInputElement, prevInput: HTMLInputElement, nextInput: HTMLInputElement) {
    if (actuelInput.value.length == 1) {
      nextInput.focus();
    }else{
      prevInput.focus();
    }
  }

  onSubmit(val1: string,val2: string,val3: string,val4: string,val5: string) {
    this.isLoading = true;
    this.error = "";
    let requesId = localStorage.getItem("requesId")!;
    let code = val1+val2+val3+val4+val5
    
    this.securityService.validation(requesId,code).subscribe((res: ResponseVerificationResponseDto)=>{
      this.isLoading = false;
      
      if (res.statusCode==200){
        this.error = "";
        let profil = res.data?.user?.profile;
        let next = res.data?.nexTransition
        localStorage.setItem("connectedUser", JSON.stringify(res.data?.user!));
        if(next == "HOME"){
          if (profil=="ADMIN_GESTION"){
            this.router.navigateByUrl('/gestion/dashboard')
          }else if (profil=="TRADER"){
            localStorage.setItem("trader","Dashboard");
            this.router.navigateByUrl('/trader/dashboard')
          }else if (profil=="INSTITUTE_ADMIN"){
            this.router.navigateByUrl('/institut/dashboard')
          }else if (profil=="SUPER_ADMIN"){
            this.router.navigateByUrl('/admin/dashboard')
          }
        }else if(next == "CHANGE_PASSWORD"){
          this.router.navigateByUrl('/change/password')
        }else if (next == "ACCEPT_CGU"){
          this.router.navigateByUrl('conditions/generales')
        }
      }else{
        this.error = "Le code de vérification est invalide";
      }
    }, (error)=>{
      this.isLoading = false;
      this.error = "Requête Non aboutie. Code de vérification est invalide";
    });
  }

}
