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
import { CountryDto } from '../../../../core/models/country/country-dto';
import { CountryServiceImpl } from '../../../../core/services/impl/country.service.impl';
import { PercentagePipe } from '../../../../core/pipes/percentage.pipe';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-carnet-ordre',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, FormatNumberPipe, PercentagePipe],
  templateUrl: './add-carnet-ordre.component.html',
  styleUrl: './add-carnet-ordre.component.css'
})
export class AddCarnetOrdreComponent {
 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  label: string = "Prix";
  minDate!: string;
  today : Date = new Date();
  sensLabel : String = "";
  resumeAsset?: ResumeAssetResponse ;
  countries: CountryDto[] = [];
  isCouponFocused: boolean = false;
  isPriceFocused: boolean = false;
  isClean: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService : TransactionServiceImpl,
    private countryService : CountryServiceImpl,
    private snackBar:MatSnackBar,
    private router: Router
  ){
    const tomorrow = new Date();
    tomorrow.setDate(this.today.getDate() + 1)
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.nature.valueChanges.subscribe((value)=>{
      if (value=="BAT"){
        this.label = "Taux";
        this.price.reset();
        this.unitaryValueName.setValue(1000000);
      }else{
        this.label = "Prix";
        this.price.reset();
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
      this.isClean = Object.values(this.form.value).every(value => !value || value.toString().trim() === '');
    });

  }


  form : FormGroup = this.fb.group({
    //transactionNumber: ["", [Validators.required]],
    countryCode: ["", [Validators.required]],
    echeanceDate: ["", [Validators.required, this.validateEcheance]],
    // emissionDate: [""],
    operationSens: ["", [Validators.required]],
    codeIsin: ["", [Validators.required]],
    price: ["", [Validators.required, this.validateDigit]],
    nature: ["", [Validators.required]],
    couponRate: ["", [this.validateDigit]],
    amount : ["", [Validators.required, this.validateQte]],
    interet: [""],
    unitaryValueName: [0],
    transactionValue: [""],
    residualDuration: [""],
  });

  // get transactionNumber(){
  //   return this.form.controls["transactionNumber"] as FormControl;
  // }

  get countryCode(){
    return this.form.controls["countryCode"] as FormControl;
  }

  get echeanceDate(){
    return this.form.controls["echeanceDate"] as FormControl;
  }

  // get emissionDate(){
  //   return this.form.controls["emissionDate"] as FormControl;
  // }

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

  validateEcheance(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    const date = new Date(value);
    if (date<tomorrow) {
      return { invaliddate: true };
    }
    return null;
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

  onAmountChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.amount.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage
  }

  onUnitaryValueNameChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.unitaryValueName.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage

  }

  onPriceChange(event: any) {
    let rawValue = event.target.value;
    if(this.nature.value == "OAT"){
      rawValue = event.target.value.replace(/\s/g, ''); 
    }else if(this.nature.value == "BAT"){
      rawValue = event.target.value.replace(" %", '');
    }
    this.price.setValue(rawValue, { emitEvent: false }); 
  }

  onPriceBlur(event: any){
    if(this.nature.value == 'BAT'){
      let rawValue = event.target.value.replace(",", ".");
      this.price.setValue(rawValue, { emitEvent: false }); 
    }
    this.isPriceFocused = false
  }

  onCouponRateChange(event: any) {
    let rawValue = event.target.value.replace(" %", ''); // supprimer % pour garder la vraie valeur
    this.couponRate.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage
  }

  onCouponRateBlur(event: any){
    let rawValue = event.target.value.replace(",", ".");
    this.couponRate.setValue(rawValue, { emitEvent: false }); 
    this.isCouponFocused = false
  }

  onChangeNature(){
    this.price.reset();
    if (this.nature.value=="BAT"){
      this.couponRate.removeValidators([Validators.required]);
      this.couponRate.reset();
    }else{
      this.couponRate.reset();
      // this.couponRate.setValue();
      this.couponRate.setValidators([Validators.required]);
    }
  }

  onSubmit(){
    if (this.form.invalid) {
      this.couponRate.markAsDirty();
      this.form.markAllAsTouched();
    }else{
      const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();
      var data = {
        // transactionNumber: this.transactionNumber.getRawValue(),
        countryCode: this.countryCode.getRawValue(),
        operationSens: this.operationSens.getRawValue(),
        nature: this.nature.getRawValue(),
        echeanceDate: this.echeanceDate.getRawValue(),
        amount : Number.parseFloat(this.amount.getRawValue()),
        codeIsin: this.codeIsin.getRawValue(),
        // emissionDate: this.emissionDate.getRawValue(),
        unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
        couponRate: this.couponRate.value != null ? Number.parseFloat(this.couponRate.getRawValue()) : 0.0 ,
        proposedPrice: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : null,
        proposedRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : null,
      }
      

      this.transactionService.getResumeOrdre(data).subscribe((res : RestResponse<ResumeAssetResponse>) => {
        closeSpinner?.click();
        console.log(res);
        
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
        console.log(error);
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

  goToCarnetOrdre(){
    this.router.navigateByUrl("/trader/carnet/ordre");
  }

  confirmSubmission(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();
    var data = {
      // transactionNumber: this.transactionNumber.getRawValue(),
      countryCode: this.countryCode.getRawValue(),
      operationSens: this.operationSens.getRawValue(),
      nature: this.nature.getRawValue(),
      echeanceDate: this.echeanceDate.getRawValue(),
      amount : Number.parseFloat(this.amount.getRawValue()),
      codeIsin: this.codeIsin.getRawValue(),
      // emissionDate: this.emissionDate.getRawValue(),
      unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
      couponRate: this.couponRate.value != null ? Number.parseFloat(this.couponRate.getRawValue()) : 0.0 ,
      proposedPrice: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : null,
      proposedRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : null,
    }

    this.transactionService.addCarnetOrdre(data).subscribe((res : any) => {
      closeSpinner?.click();
      console.log(res);
      
      if (res.statusCode==201) {
        // this.snackBar.open("Offre publiée avec succès","Ok",{
        //   duration: 5000,
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        // });
        localStorage.setItem("newCarnet","1");
        this.router.navigateByUrl("/trader/carnet/ordre")
        this.form.reset();
      } else {
        this.snackBar.open("Une erreur s'est produite lors de la publication de votre offre. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }, (error)=>{
      closeSpinner?.click();
      this.snackBar.open("Une erreur s'est produite lors de la publication. Veuillez rééssayer !","Ok",{
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      console.log(error);
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.isClean = true;
    this.countryService.getCountries().subscribe((res : RestResponse<CountryDto[]>)=>{
      if(res.statusCode==200){
        this.countries = res.data!;
      }
    });
  }
}
