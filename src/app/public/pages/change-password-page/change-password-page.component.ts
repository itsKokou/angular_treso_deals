import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDto } from '../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { initFlowbite } from 'flowbite';
import { RestResponse } from '../../../core/models/rest-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-page',
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent implements OnInit {
  connectedUser?: UserDto;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isPasswordChanged: boolean = false;

  constructor(
    private securityService: SecurityServiceImpl,
    private fb: FormBuilder,
    private snackBar:MatSnackBar,
    private router: Router
  ){
    this.connectedUser = securityService.getConnectedUser();
  }
  
  ngOnInit(): void {
    initFlowbite();
  }
  
  form = this.fb.group(
    {
      old_password : ["", [Validators.required]],
      new_password : ["", [Validators.required, Validators.pattern(/^.{6}$/), this.validMajuscule, this.validMiniscule, this.validNumber, this.validSpecial]],
      confirm_password : ["", [Validators.required, Validators.pattern(/^.{6}$/), this.validMajuscule, this.validMiniscule, this.validNumber, this.validSpecial]],
    },
    { validators: this.passwordMatchValidator('new_password', 'confirm_password') }
  );
  
  get old_password(){
      return this.form.controls["old_password"] as FormControl;
  }
  get new_password(){
      return this.form.controls["new_password"] as FormControl;
  }
  get confirm_password(){
      return this.form.controls["confirm_password"] as FormControl;
  }

  validMiniscule(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    const regex = /^(?=.*[a-z]).+$/;
    if (!regex.test(value)) {
      return { notminus: true };
    }
    return null; 
  }

  validMajuscule(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    const regex = /^(?=.*[A-Z]).+$/;
    if (!regex.test(value)) {
      return { notmaj: true };
    }
    return null; 
  }

  validNumber(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    const regex = /^(?=.*\d).+$/;
    if (!regex.test(value)) {
      return { notnumber: true };
    }
    return null; 
  }

  validSpecial(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    const regex = /^(?=.*[\W_]).+$/;
    if (!regex.test(value)) {
      return { notspecial: true };
    }
    return null; 
  }
  
  passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;
      //Ne lance pas cette validation si les autres ne sont pas OK
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6}$/;
      if (!regex.test(password) || !regex.test(confirmPassword)) {
        return null;
      }
      
      if (password !== confirmPassword) {
        return { passwordMismatch: true }; // Retourne une erreur si les mots de passe ne correspondent pas
      }
      return null; // Pas d'erreur
    };
  }
  
  onSubmit(){
    console.log(this.form.valid); 
    console.log(this.form.errors); 
    
    if(this.form.invalid){
      this.form.markAllAsTouched();
    }else{
      const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();

      const data = {
        actualPassword: this.old_password.getRawValue(),
        newPassword: this.new_password.getRawValue()
      }
      console.log(data);
      
      this.securityService.changePassword(data).subscribe((res: RestResponse<any>)=>{
        closeSpinner?.click();
        if (res.statusCode==204) {
          this.snackBar.open("Votre mot de passe a été mis à jour avec succès","Ok",{
            duration: 6000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.form.reset();
          this.isPasswordChanged = true;
        } else {
          this.snackBar.open("Une erreur s'est produite lors de la mise à jour. Veuillez rééssayer !","Ok",{
            duration: 6000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.isPasswordChanged = false;
        }
      }, (error)=>{
        closeSpinner?.click();
        this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.isPasswordChanged = false;
        
      });
    }  
  }

  goToCGU(){
    this.router.navigateByUrl('conditions/generales');
  }

}
