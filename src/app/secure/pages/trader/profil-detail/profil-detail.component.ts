import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-profil-detail',
    imports: [CommonModule, MatProgressSpinnerModule, ReactiveFormsModule],
    templateUrl: './profil-detail.component.html',
    styleUrl: './profil-detail.component.css'
})
export class ProfilDetailComponent implements OnInit {
    private securityService = inject(SecurityServiceImpl);
    private fb: FormBuilder = inject(FormBuilder);
    connectedUser? : UserDto;

    constructor() { 
        localStorage.setItem("trader","Mon Profil");
        this.connectedUser = this.securityService.getConnectedUser();
        
    }

    ngOnInit(): void {
        initFlowbite();
    }

    form : FormGroup = this.fb.group({
        old_password : ["", [Validators.required]],
        new_password : ["", [Validators.required]],
        confirm_password : ["", [Validators.required]],
    },
    { validators: this.passwordMatchValidator('new_password', 'confirm_password') });

    get old_password(){
        return this.form.controls["old_password"] as FormControl;
    }
    get new_password(){
        return this.form.controls["new_password"] as FormControl;
    }
    get confirm_password(){
        return this.form.controls["confirm_password"] as FormControl;
    }

    passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const password = formGroup.get(passwordField)?.value;
            const confirmPassword = formGroup.get(confirmPasswordField)?.value;

            if (password !== confirmPassword) {
            return { passwordMismatch: true }; // Retourne une erreur si les mots de passe ne correspondent pas
            }

            return null; // Pas d'erreur
        };
    }

    onSubmit(){
        
        if(this.form.invalid){
            this.form.markAllAsTouched();
        }else{

        }
        console.log(this.form.errors);
        
    }



}
