import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { initFlowbite } from 'flowbite';
import {Select2Data,Select2Module, Select2UpdateEvent, Select2UpdateValue } from 'ng-select2-component';
import { InstitutServiceImpl } from '../../../core/services/impl/institut.service.impl';
import { CountryServiceImpl } from '../../../core/services/impl/country.service.impl';
import { CountryDto } from '../../../core/models/country/country-dto';
import { RestResponse } from '../../../core/models/rest-response';


@Component({
  selector: 'app-add-profil-institut',
  imports: [MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, Select2Module, ReactiveFormsModule],
  templateUrl: './add-profil-institut.component.html',
  styleUrl: './add-profil-institut.component.css'
})

export class AddProfilInstitutComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  dataPays:Select2Data = []
  private fb = inject(FormBuilder);
  private institutService = inject(InstitutServiceImpl);
  flag = {
    code : "SN",
    areaCode : 221,
    flag : "https://flagcdn.com/w20/sn.png"
  };
  flagTab = [
    {
      code : "BJ",
      areaCode : 229,
      flag : "https://flagcdn.com/w20/bj.png"
    },
    {
      code : "BF",
      areaCode : 226,
      flag : "https://flagcdn.com/w20/bf.png"
    },
    {
      code : "CI",
      areaCode : 225,
      flag : "https://flagcdn.com/w20/ci.png"
    },
    {
      "code": "GW",
      areaCode : 245,
      flag : "https://flagcdn.com/w20/gw.png"
    },
    {
      code : "ML",
      areaCode : 223,
      flag : "https://flagcdn.com/w20/ml.png"
    },
    {
      code : "NE",
      areaCode : 227,
      flag : "https://flagcdn.com/w20/ne.png"
    },
    {
      code : "SN",
      areaCode : 221,
      flag : "https://flagcdn.com/w20/sn.png"
    },
    {
      code : "TG",
      areaCode : 228,
      flag : "https://flagcdn.com/w20/tg.png"
    }
  ]

  constructor(
    private snackBar:MatSnackBar,
    private countryService : CountryServiceImpl,
  ){
    
  }

  form: FormGroup = this.fb.group({
    denomination : ["", [Validators.required, Validators.minLength(2)]],
    statut : ["", [Validators.required]],
    pays : ["", [Validators.required]],
    // ville : ["", [Validators.required, Validators.minLength(2)]],
    adresse : ["", [Validators.required, Validators.minLength(2)]],
    email : ["", [Validators.required, Validators.email]],
    fixe : ["", [Validators.required, Validators.minLength(2)]],
    nom_dirigeant : ["", [Validators.required, Validators.minLength(2)]],
    prenom_dirigeant : ["", [Validators.required, Validators.minLength(2)]],
    titre_dirigeant : ["", [Validators.required]],
    
    admin_nom : ["", [Validators.required, Validators.minLength(2)]],
    admin_prenom : ["", [Validators.required, Validators.minLength(2)]],
    admin_fonction : ["", [Validators.required, Validators.minLength(2)]],
    admin_email : ["", [Validators.required, Validators.email]],
    admin_portable : ["", [Validators.required, Validators.minLength(2)]],
    admin_fixe : ["", [Validators.required, Validators.minLength(2)]],

    demandeur_nom : ["", [Validators.required, Validators.minLength(2)]],
    demandeur_prenom : ["", [Validators.required, Validators.minLength(2)]],
    demandeur_fonction : ["", [Validators.required, Validators.minLength(2)]],
    demandeur_email : ["", [Validators.required, Validators.email]],
    demandeur_portable : ["", [Validators.required, Validators.minLength(2)]],
    demandeur_fixe : ["", [Validators.required, Validators.minLength(2)]],

    checkbox: ["", [Validators.requiredTrue]]
  });

  get checkbox(){
    return this.form.controls["checkbox"] as FormControl;
  }

  get denomination(){
    return this.form.controls["denomination"] as FormControl;
  }
  get statut(){
    return this.form.controls["statut"] as FormControl;
  }
  get pays(){
    return this.form.controls["pays"] as FormControl;
  }
  // get ville(){
  //   return this.form.controls["ville"] as FormControl;
  // }
  get adresse(){
    return this.form.controls["adresse"] as FormControl;
  }
  get email(){
    return this.form.controls["email"] as FormControl;
  }
  get fixe(){
    return this.form.controls["fixe"] as FormControl;
  }
  get nom_dirigeant(){
    return this.form.controls["nom_dirigeant"] as FormControl;
  }
  get prenom_dirigeant(){
    return this.form.controls["prenom_dirigeant"] as FormControl;
  }
  get titre_dirigeant(){
    return this.form.controls["titre_dirigeant"] as FormControl;
  }

  get admin_nom(){
    return this.form.controls["admin_nom"] as FormControl;
  }
  get admin_prenom(){
    return this.form.controls["admin_prenom"] as FormControl;
  }
  get admin_fonction(){
    return this.form.controls["admin_fonction"] as FormControl;
  }
  get admin_email(){
    return this.form.controls["admin_email"] as FormControl;
  }
  get admin_portable(){
    return this.form.controls["admin_portable"] as FormControl;
  }
  get admin_fixe(){
    return this.form.controls["admin_fixe"] as FormControl;
  }

  get demandeur_nom(){
    return this.form.controls["demandeur_nom"] as FormControl;
  }
  get demandeur_prenom(){
    return this.form.controls["demandeur_prenom"] as FormControl;
  }
  get demandeur_fonction(){
    return this.form.controls["demandeur_fonction"] as FormControl;
  }
  get demandeur_email(){
    return this.form.controls["demandeur_email"] as FormControl;
  }
  get demandeur_portable(){
    return this.form.controls["demandeur_portable"] as FormControl;
  }
  get demandeur_fixe(){
    return this.form.controls["demandeur_fixe"] as FormControl;
  }
  
  //SELECT2
  paysSelected(event:Select2UpdateEvent<Select2UpdateValue>){
    if(event.value != null){
      this.flag = this.flagTab.find((value)=> value.code == event.value) || this.flag;
      this.pays.setValue(event.value);
      this.pays.removeValidators(Validators.required);
    }
  }

  abortSubmission(){
    this.form.reset();
  }
  
  ngOnInit(): void {
    initFlowbite();
    this.countryService.getCountries().subscribe((res : RestResponse<CountryDto[]>)=>{
      if(res.statusCode==200){
        for (let index = 0; index < res.data!.length; index++) {
          this.dataPays.push({value: res.data![index].code, label: res.data![index].name})
        }
      }
    });  

  }


  onSubmit(){
    localStorage.clear();//Si token retirer pour envoyer la request sans token
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      const btnAdd = document.getElementById("btnAdd");
      btnAdd?.click();
    }
  }

  confirmSubmission(){
    const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();
      var data = {
        adminRequest: {
          email: this.admin_email.getRawValue(),
          firstName: this.admin_prenom.getRawValue(),
          lastName: this.admin_nom.getRawValue(),
          job: this.admin_fonction.getRawValue(),
          fixeNumber: "+"+this.flag.areaCode.toString()+" "+this.admin_fixe.getRawValue(),
          phoneNumber: "+"+this.flag.areaCode.toString()+" "+this.admin_portable.getRawValue()
        },
        applicant: {
          email: this.demandeur_email.getRawValue(),
          firstName: this.demandeur_prenom.getRawValue(),
          lastName: this.demandeur_nom.getRawValue(),
          job: this.demandeur_fonction.getRawValue(),
          fixeNumber: "+"+this.flag.areaCode.toString()+" "+this.demandeur_fixe.getRawValue(),
          phoneNumber: "+"+this.flag.areaCode.toString()+" "+this.demandeur_portable.getRawValue()
        },
        bankRequest: {
          address: this.adresse.getRawValue(),
          // city: this.ville.getRawValue(),
          countryCode: this.pays.getRawValue(),
          email: this.email.getRawValue(),
          juridicStatus: this.statut.getRawValue(),
          managerFirstName: this.prenom_dirigeant.getRawValue(),
          managerLastName: this.nom_dirigeant.getRawValue(),
          managerTitle: this.titre_dirigeant.getRawValue(),
          name: this.denomination.getRawValue(),
          phoneNumber: "+"+this.flag.areaCode.toString()+" "+this.fixe.getRawValue()
        }
      }
  
      this.institutService.addProfilInstitut(data).subscribe((res ) => {
        closeSpinner?.click();
        console.log(res);
        
        if (res.statusCode==204) {
          this.snackBar.open("Votre requête a bien été soumise et est prise en charge","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.form.reset();
        } else {
          this.snackBar.open("Une erreur s'est produite : L'e-mail du responsable informatique/demandeur est déjà utilisé !","Ok",{
            duration: 6000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }, (error)=>{
        closeSpinner?.click();
        console.log(error);
        this.snackBar.open("Une erreur s'est produite lors de l'envoi. Veuillez rééssayer plus tard!","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
  }
}
