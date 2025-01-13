import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AssetResponse } from '../../../../core/models/carnet-ordre/asset-response';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import { ResponseAssetResponse } from '../../../../core/models/carnet-ordre/response-asset-response';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProposalResponse } from '../../../../core/models/carnet-ordre/proposal-response';
import { PropositionServiceImpl } from '../../../../core/services/impl/proposition.service.impl';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProposalEnum } from '../../../../core/models/enum/proposal-enum';
import { Proposal } from '../../../../core/models/carnet-ordre/proposal';

@Component({
  standalone: true,
  selector: 'app-carnet-ordre',
  imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './carnet-ordre.component.html',
  styleUrl: './carnet-ordre.component.css'
})
export class CarnetOrdreComponent implements AfterViewInit {

  totalElements: number = 0; 
  selectedCarnet: AssetResponse = {}; 
  selectedProposal: ProposalResponse = {};
  proposalMessage: string = "l\'acceptation" 
  selectedStatut!: ProposalEnum.StatusEnum; 
  selectedNature: String = "TOUT";
  selectedSens: String = "TOUT";
  isLoading: boolean = false;
  isProposalLoading: boolean = false;
  allDatas: AssetResponse[] = []; 
  allDatasFiltered: AssetResponse[] = []; 
  allProposals: ProposalResponse[] = []; 
  datasPaginated: AssetResponse[] = []; 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  pageEvent : PageEvent = new PageEvent();
  label: string = "Prix";
  minDate!: string;
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private fb = inject(FormBuilder);

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private propositionService: PropositionServiceImpl,
    private snackBar: MatSnackBar
  ){
    localStorage.setItem("trader","Carnet d'ordres");
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.nature.valueChanges.subscribe((value)=>{
      if (value=="BAT"){
        this.label = "Taux"
      }else{
        this.label = "Prix"
      }
    });
  }

  formRecherche = this.fb.group({
    num_transaction: "",
    date: "",
    emetteur: "",
    natureC: "",
    code: "",
    taux: "",
  })

  get num_transaction(){
    return this.formRecherche.controls["num_transaction"] as FormControl;
  }
  get date(){
    return this.formRecherche.controls["date"] as FormControl;
  }
  get emetteur(){
    return this.formRecherche.controls["emetteur"] as FormControl;
  }
  get natureC(){
    return this.formRecherche.controls["natureC"] as FormControl;
  }
  get code(){
    return this.formRecherche.controls["code"] as FormControl;
  }
  get taux(){
    return this.formRecherche.controls["taux"] as FormControl;
  }

  // ----------- Form2 for update

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

  rechercherOffres() {
    console.log(this.formRecherche.value);
    const {... data} = this.formRecherche.value
    this.allDatasFiltered = this.allDatas.filter(item => item.codeIsin?.includes(data.code!) && item.issuerCountry?.includes(data.emetteur!) 
    && item.nature?.includes(data.natureC!) && item.echeanceDate?.includes(data.date!));

    if (data.num_transaction != null  && data.num_transaction != ""){
      var num = Number.parseInt(data.num_transaction);
      this.allDatasFiltered = this.allDatasFiltered.filter(item => item.id ==num);
    }

    if (data.taux != null  && data.taux != ""){
      var taux = Number.parseFloat(data.taux);
      this.allDatasFiltered = this.allDatasFiltered.filter(item => item.transactionRate ==taux);
    }

    this.totalElements = this.allDatasFiltered.length;
    this.datasPaginated = this.allDatasFiltered.slice(0*5, (0 + 1)*5)
  }


  ngAfterViewInit() {
    initFlowbite();
    this.matPaginatorIntl.itemsPerPageLabel="Utilisateurs par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";
  }

  ngOnInit(): void {
    this.isLoading = true;
    // this.userService.getUserByInstitutionId(this.connectedUser.institutionId!).subscribe((res: ResponseInstituteUserDTO)=>{
    this.transactionService.getAllCarnetOrdre().subscribe((res: ResponseAssetResponse)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
        this.allDatasFiltered = this.allDatas;
        this.datasPaginated = this.allDatasFiltered.slice(0*5, (0 + 1)*5)
        this.totalElements = this.allDatasFiltered.length;
      }
    });
  }

  
  onPageChange(event: PageEvent) {
    this.datasPaginated = this.allDatasFiltered.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  filter() {
    if (this.selectedNature == "TOUT"){
      if(this.selectedSens == "TOUT"){
        this.allDatasFiltered = this.allDatas;
      }else{
        this.allDatasFiltered = this.allDatas.filter(item => item.operationSens == this.selectedSens);
      }
    }else{
      if(this.selectedSens == "TOUT"){
        this.allDatasFiltered = this.allDatas.filter(item => item.nature == this.selectedNature);
      }else{
        this.allDatasFiltered = this.allDatas.filter(item => item.operationSens == this.selectedSens && item.nature == this.selectedNature);
      }
    }
    this.totalElements = this.allDatasFiltered.length;
    this.datasPaginated = this.allDatasFiltered.slice(0*5, (0 + 1)*5)
  }

  filterBySensTransaction(sens: string) {
    this.selectedSens = sens;
    this.filter();
  }

  filterByNature(nature: string) {
    this.selectedNature = nature;
    this.filter();
  }

  voirDetail(carnet: AssetResponse) {
    //charger les données de item sur le modal
    this.isProposalLoading = true;
    this.allProposals = [];
    this.selectedCarnet = carnet;
    this.propositionService.getAllProposalsByAssetId(carnet.id!).subscribe((res)=>{
      this.isProposalLoading = false;
      this.allProposals = res.data!;
    });
    document.getElementById("btnDetail")?.click();
  }

  openSupprimerModal(btnSupprimer: HTMLButtonElement,carnet: AssetResponse) {
    this.selectedCarnet = carnet;
    btnSupprimer.click();
  }

  deleteCarnet(){
    this.transactionService.deleteCarnetOrdre(this.selectedCarnet.id!).subscribe((res)=>{
      if (res.statusCode == 204){
        this.snackBar.open("Carnet d'ordre supprimé avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.paginator.firstPage();
        this.ngOnInit();
      }
      
    });
  }

  openUpdateModal(btnUpdate: HTMLButtonElement,carnet: AssetResponse) {
    this.selectedCarnet = carnet;
    this.form.reset();
    console.log(carnet);
    
    this.form.setValue({
      transactionNumber: carnet.transactionNumber,
      issuerCountry: carnet.issuerCountry,
      echeanceDate: carnet.echeanceDate,
      operationSens: carnet.operationSens,
      codeIsin: carnet.codeIsin,
      price: carnet.price?.toString(),
      nature: carnet.nature,
      couponRate: carnet.couponRate?.toString(),
      amount : carnet.amount?.toString(),
      interet: carnet.interet?.toString(),
      unitaryValueName: carnet.unitaryValueName?.toString(),
      transactionValue: carnet.transactionValue?.toString(),
      residualDuration: carnet.residualDuration?.toString()
    });
    btnUpdate.click();
  }

  abortUpdate(){
    this.form.reset();
  }

  updateCarnet(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      //Ajouter
      const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();
      var data = {
        id: this.selectedCarnet.id,
        transactionNumber: this.transactionNumber.getRawValue(),
        availableAmount: this.selectedCarnet.availableAmount,
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

      this.transactionService.updateCarnetOrdre(data).subscribe((res : ResponseAssetResponse) => {
        closeSpinner?.click();
        if (res.statusCode==200) {
          this.snackBar.open("Carnet d'ordre mis à jour avec succès","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.form.reset();
          document.getElementById("hideUpdate")?.click();
          this.paginator.firstPage();
          this.ngOnInit();
        } else {
          this.snackBar.open("Une erreur s'est produite lors de la modification. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }

      }, (error)=>{
        closeSpinner?.click();
        this.snackBar.open("Une erreur s'est produite lors de la modification. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        console.log(error);
      });
    }
  }

  openTreatmentModal(proposal: ProposalResponse, statut: ProposalEnum.StatusEnum, message: string){
    this.selectedProposal = proposal;
    this.selectedStatut = statut;
    this.proposalMessage = message;
    document.getElementById("closeDetail")?.click();
    document.getElementById("btnConfirm")?.click();
  }

  treatProposal(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();

    this.selectedProposal.status = this.selectedStatut;
    
    this.propositionService.treatProposal(this.selectedProposal.id, this.selectedStatut, this.selectedProposal).subscribe((res : ResponseAssetResponse) => {
        closeSpinner?.click();
        if (res.statusCode==204) {
          this.snackBar.open("Proposition validée avec succès","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.voirDetail(this.selectedCarnet);
        } else {
          this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.voirDetail(this.selectedCarnet);
        }
      }, (error)=>{
        closeSpinner?.click();
        this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.voirDetail(this.selectedCarnet);
        console.log(error);
    });
  }

}
