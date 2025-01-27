import { CommonModule, formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormatNumberPipe } from '../../../../core/pipes/format-number.pipe';
import { ResumeAssetResponse } from '../../../../core/models/carnet-ordre/resume-asset-response';
import { RestResponse } from '../../../../core/models/rest-response';

@Component({
  standalone: true,
  selector: 'app-add-carnet-ordre',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, FormatNumberPipe],
  templateUrl: './add-carnet-ordre.component.html',
  styleUrl: './add-carnet-ordre.component.css'
})
export class AddCarnetOrdreComponent {
 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  label: string = "Prix";
  canDelete:boolean = false;
  minDate!: string;
  today : Date = new Date();
  sensLabel : String = "";
  resumeAsset?: ResumeAssetResponse 

  constructor(
    private fb: FormBuilder,
    private transactionService : TransactionServiceImpl,
    private snackBar:MatSnackBar,
  ){
    const tomorrow = new Date();
    tomorrow.setDate(this.today.getDate() + 1)
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.nature.valueChanges.subscribe((value)=>{
      if (value=="BAT"){
        this.label = "Taux"
        this.unitaryValueName.setValue(1000000);
      }else{
        this.label = "Prix"
        this.unitaryValueName.setValue(10000);
      }
    });
    this.operationSens.valueChanges.subscribe((value)=>{
      if (value=="ACHAT"){
        this.sensLabel = "d'achat"
      }else{
        this.sensLabel = "de cession"
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
    emissionDate: ["", [Validators.required]],
    operationSens: ["", [Validators.required]],
    codeIsin: ["", [Validators.required]],
    price: ["", [Validators.required, this.validateDigit]],
    nature: ["", [Validators.required]],
    couponRate: ["", [Validators.required, this.validateDigit]],
    amount : ["", [Validators.required, this.validateQte]],
    interet: [""],
    unitaryValueName: [0],
    transactionValue: [""],
    residualDuration: [""],
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

  get emissionDate(){
    return this.form.controls["emissionDate"] as FormControl;
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
      const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();
      var data = {
        transactionNumber: this.transactionNumber.getRawValue(),
        operationSens: this.operationSens.getRawValue(),
        nature: this.nature.getRawValue(),
        echeanceDate: this.echeanceDate.getRawValue(),
        amount : Number.parseFloat(this.amount.getRawValue()),
        codeIsin: this.codeIsin.getRawValue(),
        emissionDate: this.emissionDate.getRawValue(),
        unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
        couponRate: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.couponRate.getRawValue()) : null,
        proposedPrice: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : null,
        proposedRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : null,
      }


      this.transactionService.getResumeOrdre(data).subscribe((res : RestResponse<ResumeAssetResponse>) => {
        closeSpinner?.click();
        if (res.statusCode==200) {
          this.resumeAsset = res.data!;
          const btnAdd = document.getElementById("btnAdd");
          btnAdd?.click();
        } else {
          this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }, (error)=>{
        closeSpinner?.click();
        this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      });
      
    }
  }

  abortSubmission(){
    this.form.reset();
  }

  confirmSubmission(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();
    // var data = {
    //   transactionNumber: this.transactionNumber.getRawValue(),
    //   issuerCountry: this.issuerCountry.getRawValue(),
    //   echeanceDate: this.echeanceDate.getRawValue(),
    //   operationSens: this.operationSens.getRawValue(),
    //   codeIsin: this.codeIsin.getRawValue(),
    //   nature: this.nature.getRawValue(),
    //   unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
    //   emissionDate : this.emissionDate.getRawValue(),

      

    //   couponRate: Number.parseFloat(this.couponRate.getRawValue()),
    //   price: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : 1,
    //   amount : Number.parseFloat(this.amount.getRawValue()),
    //   interet: Number.parseFloat(this.interet.getRawValue()),
    //   unitaryValueName: Number.parseFloat(this.unitaryValueName.getRawValue()),
    //   transactionValue: Number.parseFloat(this.transactionValue.getRawValue()),
    //   residualDuration: Number.parseFloat(this.residualDuration.getRawValue()),
    //   transactionRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : 1,
    // }
    var data = {
      transactionNumber: this.transactionNumber.getRawValue(),
      operationSens: this.operationSens.getRawValue(),
      nature: this.nature.getRawValue(),
      echeanceDate: this.echeanceDate.getRawValue(),
      amount : Number.parseFloat(this.amount.getRawValue()),
      codeIsin: this.codeIsin.getRawValue(),
      emissionDate: this.emissionDate.getRawValue(),
      unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
      couponRate: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.couponRate.getRawValue()) : null,
      proposedPrice: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : null,
      proposedRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : null,
    }

    this.transactionService.addCarnetOrdre(data).subscribe((res : any) => {
      closeSpinner?.click();
      console.log(res);
      
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
