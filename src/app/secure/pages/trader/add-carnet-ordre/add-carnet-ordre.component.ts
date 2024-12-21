import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-add-carnet-ordre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './add-carnet-ordre.component.html',
  styleUrl: './add-carnet-ordre.component.css'
})
export class AddCarnetOrdreComponent {

  form : FormGroup = this.fb.group({
    issuerCountry: ["", [Validators.required]],
    echeanceDate: ["", [Validators.required]],

    operationSens: ["", [Validators.required]],
    codeIsin: ["", [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],

    nature: ["", [Validators.required]],
    couponRate: [0, [Validators.required, Validators.min(1)]],
    amount : [0, [Validators.required, Validators.min(1)]],
    interet: [0, [Validators.required, Validators.min(1)]],
  });

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

  constructor(
    private fb: FormBuilder,
  ){}


  onSubmit(){
    var {... data} = this.form.getRawValue();
    console.log(data);
    
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
