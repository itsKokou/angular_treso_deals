import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AssetResponse } from '../../../../core/models/carnet-ordre/asset-response';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProposalResponse } from '../../../../core/models/carnet-ordre/proposal-response';
import { PropositionServiceImpl } from '../../../../core/services/impl/proposition.service.impl';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProposalEnum } from '../../../../core/models/enum/proposal-enum';
import { RestResponse } from '../../../../core/models/rest-response';
import { FormatNumberPipe } from '../../../../core/pipes/format-number.pipe';
import { CountryDto } from '../../../../core/models/country/country-dto';
import { CountryServiceImpl } from '../../../../core/services/impl/country.service.impl';
import { PercentagePipe } from '../../../../core/pipes/percentage.pipe';

@Component({
  standalone: true,
  selector: 'app-carnet-ordre',
  imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, MatProgressSpinnerModule, FormatNumberPipe, PercentagePipe ],
  templateUrl: './carnet-ordre.component.html',
  styleUrl: './carnet-ordre.component.css',
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
  countries: CountryDto[] = [];
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private fb = inject(FormBuilder);
  isCouponFocused: boolean = false;
  isPriceFocused: boolean = false;
  isSearch: boolean = false;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private countryService : CountryServiceImpl,
    private propositionService: PropositionServiceImpl,
    private snackBar: MatSnackBar
  ){
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.nature.valueChanges.subscribe((value)=>{
      if (value=="BAT"){
        this.label = "Taux"
        this.unitaryValueName.setValue(1000000);
      }else{
        this.label = "Prix"
        this.unitaryValueName.setValue(10000);
      }
    });
  }

  formRecherche = this.fb.group({
    num_transaction: "",
    dateD: "",
    dateF: "",
    emetteur: "",
    natureC: "",
    code: "",
  })

  get num_transaction(){
    return this.formRecherche.controls["num_transaction"] as FormControl;
  }
  get dateD(){
    return this.formRecherche.controls["dateD"] as FormControl;
  }
  get dateF(){
    return this.formRecherche.controls["dateF"] as FormControl;
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


  // ----------- Form2 for update

  form : FormGroup = this.fb.group({
    transactionNumber: ["", [Validators.required]],
    issuerCountry: ["", [Validators.required]],
    echeanceDate: ["", [Validators.required]],
    operationSens: ["", [Validators.required]],
    codeIsin: ["", [Validators.required]],
    price: ["", [Validators.required, this.validateDigit]],
    nature: ["", [Validators.required]],
    couponRate: ["", [this.validateDigit]],
    amount : ["", [Validators.required, this.validateQte]],
    emissionDate: ["", [Validators.required]],
    unitaryValueName: [0],
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

  get emissionDate(){
    return this.form.controls["emissionDate"] as FormControl;
  }
  
  get unitaryValueName(){
    return this.form.controls["unitaryValueName"] as FormControl;
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
    console.log(this.amount.value);
  }

  onUnitaryValueNameChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.unitaryValueName.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage
    console.log(this.unitaryValueName.value);
  }

  onPriceChange(event: any) {
    let rawValue = event.target.value;
    if(this.nature.value == "OAT"){
      rawValue = event.target.value.replace(/\s/g, ''); 
    }else if(this.nature.value == "BAT"){
      rawValue = event.target.value.replace(" %", '');
    }
    this.price.setValue(rawValue, { emitEvent: false }); 
    console.log(this.price.value);
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
    console.log(this.couponRate.value);
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
      this.couponRate.setValue(0.0)
      this.couponRate.addValidators([Validators.required]);
    }
  }

  reinitialiserRecherche(){
    this.formRecherche.setValue({
      num_transaction: "",
      dateD: "",
      dateF: "",
      emetteur: "",
      natureC: "",
      code: ""
    })
    this.isSearch = false;
    this.ngOnInit();
  }

  rechercherOffres() {
    const {... data} = this.formRecherche.value
    
    if ((data.code != null && data.code.toString().trim() != "") 
      || (data.dateD != null && data.dateD.toString().trim() != "") 
      || (data.dateF != null && data.dateF.toString().trim() != "") 
      || (data.emetteur != null && data.emetteur.toString().trim() != "") 
      || (data.natureC != null && data.natureC.toString().trim() != "") 
      || (data.num_transaction != null && data.num_transaction.toString().trim() != "")
    ){
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }

    this.allDatasFiltered = this.allDatas.filter(item => item.codeIsin?.toLowerCase().includes(data.code!.toLowerCase()) && item.issuerCountry?.includes(data.emetteur!) 
    && item.nature?.includes(data.natureC!));

    if (data.num_transaction != null  && data.num_transaction != ""){
      var num = Number.parseInt(data.num_transaction);
      this.allDatasFiltered = this.allDatasFiltered.filter(item => item.id ==num);
    }

    if(data.dateD != null && data.dateD.toString().trim() != ""){
      const debut = new Date(data.dateD);
      if (data.dateF != null && data.dateF.toString().trim() != "") {
        const fin = new Date(data.dateF);
        this.allDatasFiltered = this.allDatasFiltered.filter(item => debut <= new Date(item.date!) && new Date(item.date!) <= fin );
      } else {
        this.allDatasFiltered = this.allDatasFiltered.filter(item => debut <= new Date(item.date!));
      }
    }else{
      if (data.dateF != null && data.dateF.toString().trim() != "") {
        const fin = new Date(data.dateF);
        this.allDatasFiltered = this.allDatasFiltered.filter(item => new Date(item.date!) <= fin );
      }
    }

    this.totalElements = this.allDatasFiltered.length;
    this.datasPaginated = this.allDatasFiltered.slice(0*20, (0 + 1)*20)
  }


  ngAfterViewInit() {
    initFlowbite();
    this.matPaginatorIntl.itemsPerPageLabel="Offres par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";

  }

  ngOnInit(): void {
    if (localStorage.getItem("newCarnet") == "1") {
      this.snackBar.open("Offre publiée avec succès","Ok",{
        duration: 6000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      localStorage.removeItem("newCarnet");
    }
    //Pour la recherche
    this.isSearch = false;
    this.isLoading = true;
    
    this.transactionService.getAllCarnetOrdre().subscribe((res: RestResponse<AssetResponse[]>)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!.reverse();
        this.allDatasFiltered = this.allDatas;
        this.datasPaginated = this.allDatasFiltered.slice(0*20, (0 + 1)*20)
        this.totalElements = this.allDatasFiltered.length;
      }
    });

    this.countryService.getCountries().subscribe((res : RestResponse<CountryDto[]>)=>{
      if(res.statusCode==200){
        this.countries = res.data!;
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
    this.datasPaginated = this.allDatasFiltered.slice(0*20, (0 + 1)*20)
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
    if (this.selectedCarnet.nature=="OAT"){
      this.couponRate.addValidators([Validators.required]);
      // this.isCouponFocused = false;
    }
    const pays = this.countries.find((value)=>value.name == carnet.issuerCountry);
    
    this.form.setValue({
      transactionNumber: carnet.transactionNumber,
      operationSens: carnet.operationSens,
      nature: carnet.nature,
      issuerCountry: pays?.code,
      echeanceDate: carnet.echeanceDate,
      codeIsin: carnet.codeIsin,
      price: carnet.nature == "OAT" ? carnet.proposedPrice?.toString() : carnet.proposedRate?.toString(),
      couponRate: carnet.couponRate != null ? carnet.couponRate.toString() : 0.0 ,
      amount : carnet.amount?.toString(),
      unitaryValueName: carnet.nature == "OAT" ? 10000 : 1000000,
      emissionDate: carnet.valueDate?.toString()
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
        operationSens: this.operationSens.getRawValue(),
        nature: this.nature.getRawValue(),
        countryCode: this.issuerCountry.getRawValue(),
        echeanceDate: this.echeanceDate.getRawValue(),
        amount : Number.parseFloat(this.amount.getRawValue()),
        codeIsin: this.codeIsin.getRawValue(),
        emissionDate: this.emissionDate.getRawValue(),
        proposedPrice: this.nature.getRawValue() == "OAT" ? Number.parseFloat(this.price.getRawValue()) : null,
        proposedRate: this.nature.getRawValue() == "BAT" ? Number.parseFloat(this.price.getRawValue()) : null,
        couponRate: this.couponRate.value != null ? Number.parseFloat(this.couponRate.getRawValue()) : 0.0 ,
        // interet: Number.parseFloat(this.interet.getRawValue()),
        unitaryNominalValue: Number.parseFloat(this.unitaryValueName.getRawValue()),
        // transactionValue: Number.parseFloat(this.transactionValue.getRawValue()),
        // residualDuration: Number.parseFloat(this.residualDuration.getRawValue()),
      }

      console.log(data);

      this.transactionService.updateCarnetOrdre(data).subscribe((res : any) => {
        closeSpinner?.click();
        console.log(res);
        
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
    
    this.propositionService.treatProposal(this.selectedProposal.id, this.selectedStatut, this.selectedProposal).subscribe((res : any) => {
        closeSpinner?.click();
        if (res.statusCode==204) {
          if(this.selectedStatut == "ACCEPTED"){
            this.snackBar.open("Proposition validée avec succès","Ok",{
              duration: 5000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }else if (this.selectedStatut == "REJECTED"){
            this.snackBar.open("Proposition rejetée avec succès","Ok",{
              duration: 5000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
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
