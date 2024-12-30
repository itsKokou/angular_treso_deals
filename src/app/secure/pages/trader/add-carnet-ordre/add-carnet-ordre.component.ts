import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import { ResponseAssetResponse } from '../../../../core/models/carnet-ordre/response-asset-response';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-add-carnet-ordre',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './add-carnet-ordre.component.html',
  styleUrl: './add-carnet-ordre.component.css'
})
export class AddCarnetOrdreComponent {
 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  label: string = "Prix";
  canDelete:boolean = false;
  minDate!: string;

  constructor(
    private fb: FormBuilder,
    private transactionService : TransactionServiceImpl,
    private snackBar:MatSnackBar,
  ){
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.nature.valueChanges.subscribe((value)=>{
      if (value=="BAT"){
        this.label = "Taux"
      }else{
        this.label = "Prix"
      }
    });
    this.form.valueChanges.subscribe((value)=>{
      if (!value){
        this.canDelete = false;
      }else{
        this.canDelete = true;
      }
    });
  }

  form : FormGroup = this.fb.group({
    transactionNumber: ["", [Validators.required]],
    issuerCountry: ["", [Validators.required]],
    echeanceDate: ["", [Validators.required]],
    operationSens: ["", [Validators.required]],
    codeIsin: ["", [Validators.required]],
    price: ["", [Validators.required, this.validateDigit]],
    nature: ["", [Validators.required]],
    couponRate: ["", [Validators.required, this.validateDigit]],
    amount : ["", [Validators.required, this.validateQte]],
    interet: ["", [Validators.required, this.validateDigit]],
    unitaryValueName: ["", [Validators.required, this.validateDigit]],
    transactionValue: ["", [Validators.required, this.validateDigit]],
    residualDuration: ["", [Validators.required, this.validateDigit]],
  });

  get transactionNumber(){
    return this.form.controls["transactionNumber"] as FormControl;
  }

  get issuerCountry(){
    return this.form.controls["issuerCountry"] as FormControl;
  }

  get echeanceDate(){
    return this.form.controls["echeanceDate"] as FormControl;
  }

  get operationSens(){
    return this.form.controls["operationSens"] as FormControl;
  }

  get codeIsin(){
    return this.form.controls["codeIsin"] as FormControl;
  }

  get price(){
    return this.form.controls["price"] as FormControl;
  }

  get nature(){
    return this.form.controls["nature"] as FormControl;
  }

  get couponRate(){
    return this.form.controls["couponRate"] as FormControl;
  }

  get amount(){
    return this.form.controls["amount"] as FormControl;
  }
  get interet(){
    return this.form.controls["interet"] as FormControl;
  }
  get unitaryValueName(){
    return this.form.controls["unitaryValueName"] as FormControl;
  }
  get transactionValue(){
    return this.form.controls["transactionValue"] as FormControl;
  }
  get residualDuration(){
    return this.form.controls["residualDuration"] as FormControl;
  }

  validateDigit(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    const normalizedValue = value.replace(',', '.');
    const numberRegex = /^(\d+(\.\d+)?|\d+(\,\d+)?|\.\d+)$/;
    if (!numberRegex.test(normalizedValue)) {
      return { isnotdigit: true };
    }
    return null; 
  }

  validateQte(control: AbstractControl): ValidationErrors | null {
    var value : string = control.value;
    if (!value) {
      return null; 
    }
    if(value.includes(',') || value.includes('.')){
      return { isnotdigit: true };
    }
    const numberRegex = /^(\d+(\.\d+)?|\d+(\,\d+)?|\.\d+)$/;
    if (!numberRegex.test(value)) {
      return { isnotdigit: true };
    }
    return null; 
  }


  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      const btnAdd = document.getElementById("btnAdd");
      btnAdd?.click();
    }
  }

  abortSubmission(){
    this.form.reset();
  }

  confirmSubmission(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();
    var data = {
      transactionNumber: this.transactionNumber.getRawValue(),
      issuerCountry: this.issuerCountry.getRawValue(),
      echeanceDate: this.echeanceDate.getRawValue(),
      operationSens: this.operationSens.getRawValue(),
      codeIsin: this.codeIsin.getRawValue(),
      price: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : 1,
      nature: this.nature.getRawValue(),
      couponRate: Number.parseFloat(this.couponRate.getRawValue()),
      amount : Number.parseFloat(this.amount.getRawValue()),
      interet: Number.parseFloat(this.interet.getRawValue()),
      unitaryValueName: Number.parseFloat(this.unitaryValueName.getRawValue()),
      transactionValue: Number.parseFloat(this.transactionValue.getRawValue()),
      residualDuration: Number.parseFloat(this.residualDuration.getRawValue()),
      transactionRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : 1,
    }

    this.transactionService.addCarnetOrdre(data).subscribe((res : ResponseAssetResponse) => {
      closeSpinner?.click();
      if (res.statusCode==201) {
        this.snackBar.open("Carnet d'ordre ajouté avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.form.reset();
      } else {
        this.snackBar.open("Une erreur s'est produite lors de l'ajout. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }, (error)=>{
      closeSpinner?.click();
      this.snackBar.open("Une erreur s'est produite lors de l'ajout. Veuillez rééssayer !","Ok",{
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      console.log(error);
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
