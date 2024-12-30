import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { initFlowbite } from 'flowbite';
import { Select2Module } from 'ng-select2-component';

@Component({
  standalone: true,
  selector: 'app-add-profil-institut',
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, Select2Module ],
  templateUrl: './add-profil-institut.component.html',
  styleUrl: './add-profil-institut.component.css'
})
export class AddProfilInstitutComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  dataPays:any = []

  form: FormGroup = this.fb.group({
    denomination : ["", [Validators.required, Validators.minLength(2)]],
    statut : ["", [Validators.required, Validators.minLength(2)]],
    pays : ["", [Validators.required]],
    ville : ["", [Validators.required, Validators.minLength(2)]],
    adresse : ["", [Validators.required, Validators.minLength(2)]],
    email : ["", [Validators.required, Validators.email]],
    fixe : ["", [Validators.required, Validators.minLength(2)]],
    nom_dirigeant : ["", [Validators.required, Validators.minLength(2)]],
    prenom_dirigeant : ["", [Validators.required, Validators.minLength(2)]],
    titre_dirigeant : ["", [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private snackBar:MatSnackBar
  ){}

  
  ngOnInit(): void {
    initFlowbite();
    const paysAfriqueOuest = [
      "Bénin", "Burkina Faso", "Cap-Vert", "Côte d'Ivoire", "Gambie", "Ghana", "Guinée",
      "Guinée-Bissau", "Liberia", "Mali", "Niger", "Nigeria", "Sénégal", "Sierra Leone",
      "Togo"
    ];

    for (let index = 0; index < paysAfriqueOuest.length; index++) {
      this.dataPays.push({value: paysAfriqueOuest[index], label: paysAfriqueOuest[index]})
    }

  }

  onSubmit(){

  }


}
