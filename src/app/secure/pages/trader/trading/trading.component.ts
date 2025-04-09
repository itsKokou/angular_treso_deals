import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AssetResponse } from '../../../../core/models/carnet-ordre/asset-response';
import { ProposalResponse } from '../../../../core/models/carnet-ordre/proposal-response';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import { PropositionServiceImpl } from '../../../../core/services/impl/proposition.service.impl';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormatNumberPipe } from '../../../../core/pipes/format-number.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { RestResponse } from '../../../../core/models/rest-response';
import { CountryDto } from '../../../../core/models/country/country-dto';
import { CountryServiceImpl } from '../../../../core/services/impl/country.service.impl';
import { PercentagePipe } from '../../../../core/pipes/percentage.pipe';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-trading',
  imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, MatProgressSpinnerModule, FormatNumberPipe, PercentagePipe],
  templateUrl: './trading.component.html',
  styleUrl: './trading.component.css'
})
export class TradingComponent implements OnInit, AfterViewInit, OnDestroy {
  totalElements: number = 0; 
  selectedCarnet: AssetResponse = {}; 
  selectedNature: String = "TOUT";
  selectedSens: String = "TOUT";
  isLoading: boolean = false;
  allDatas: AssetResponse[] = []; 
  allDatasFiltered: AssetResponse[] = []; 
  allProposals: ProposalResponse[] = []; 
  datasPaginated: AssetResponse[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  countries: CountryDto[] = [];
  today: Date = new Date();
  isSearch: boolean = false;
  // ------- Proposition
  unitaryNominalValue: number = 0;
  totalNominalValue: number = 0;
  interet: number = 0; 
  rendementEstime: number = 0; 
  prix: number = 0; 
  tauxTransaction: number = 0; 
  total: number = 0;
  margeOat: number = 20;
  margeBat: number = 0.1;
  isTauxProposeFocused: boolean = false;
  
  private refreshSubscription!: Subscription;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private propositionService: PropositionServiceImpl,
    private countryService : CountryServiceImpl,
    private fb: FormBuilder,
    private snackBar:MatSnackBar
  ){
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
  //---------------- Form Proposition
  formProposition = this.fb.group({
    quantite: [0, [Validators.required, Validators.min(1), this.validateQte]],
    prixPropose: [0, []],
    tauxPropose: [0, []],
  })

  get quantite(){
    return this.formProposition.controls["quantite"] as FormControl;
  }
  get prixPropose(){
    return this.formProposition.controls["prixPropose"] as FormControl;
  }
  get tauxPropose(){
    return this.formProposition.controls["tauxPropose"] as FormControl;
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

    if ((data.code != null && data.code.toString().trim() != "") 
      || (data.dateD != null && data.dateD.toString().trim() != "") 
      || (data.dateF != null && data.dateF.toString().trim() != "") 
      || (data.emetteur != null && data.emetteur.toString().trim() != "") 
      || (data.natureC != null && data.natureC.toString().trim() != "") 
      || (data.num_transaction != null && data.num_transaction.toString().trim() != "")
    ){
      this.isSearch = true;
      
      if (this.totalElements == 0) {
        this.snackBar.open("Information(s) non retrouvée(s) suivant critères indiqués","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    } else {
      this.isSearch = false;
    }
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
    this.isLoading = true;
    this.isSearch = false;
    this.refreshSubscription = timer(0, 3000) // exécute immédiatement puis toutes les 10s
    .pipe(
      switchMap(() => this.transactionService.getTransactionEncours())
    )
    .subscribe((res: RestResponse<AssetResponse[]>) => {
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!.reverse();
        this.allDatasFiltered = this.allDatas;
        this.datasPaginated = this.allDatasFiltered.slice(0 * 20, (0 + 1) * 20);
        this.totalElements = this.allDatasFiltered.length;
      }
    });

    this.countryService.getCountries().subscribe((res : RestResponse<CountryDto[]>)=>{
      if(res.statusCode==200){
        this.countries = res.data!;
      }
    });
  }

  ngOnDestroy(): void {
    // Très important pour éviter les fuites mémoire
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
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


  voirDetail(btnDetail: HTMLButtonElement,carnet: AssetResponse) {
    //charger les données de item sur le modal
    this.allProposals = []; 
    this.selectedCarnet = carnet;
    this.propositionService.getAllProposalsByAssetId(carnet.id!).subscribe((res)=>{
      this.allProposals = res.data!;
    });
    btnDetail.click();
  }

  faireProposition(btnProposition: HTMLButtonElement,carnet: AssetResponse) {
    this.selectedCarnet = carnet;
    if(this.selectedCarnet.nature == "BAT"){
      this.unitaryNominalValue = 1000000;
      this.tauxPropose.addValidators([Validators.required, this.validateDigit])
    }else{
      this.unitaryNominalValue = 10000;
      this.prixPropose.addValidators([Validators.required, Validators.min(1), this.validateDigit])
    }
    this.quantite.addValidators(Validators.max(carnet.amount!))
    btnProposition.click();
  }

  abortProposition(){
    this.quantite.clearValidators();
    this.quantite.reset();
    this.formProposition.reset();
    this.unitaryNominalValue = 0;
    this.totalNominalValue = 0;
    this.interet = 0; 
    this.rendementEstime = 0; 
    this.prix = 0; 
    this.tauxTransaction = 0; 
    this.total = 0;
    this.margeOat = 20;
    this.margeBat = 0.1;
    this.isTauxProposeFocused = false;
  }

  onQuantiteChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.quantite.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage

    if(!isNaN(Number(this.quantite.value))){
      this.totalNominalValue = this.quantite.value*this.unitaryNominalValue;
    }

    //total
    if(Number(this.quantite.value) > 0){
      if (this.selectedCarnet.nature == "OAT") {
        this.calculInteretOat();
        this.total = (this.prix * Number.parseInt(this.quantite.value)) + this.interet;
      } else {
        if(this.tauxTransaction > 0){
          this.calculInteretEtTotalBat();
        }
      }
    }
  }

  onPrixChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.prixPropose.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage

    if(!isNaN(Number(this.prixPropose.value)) && this.prixPropose.value.toString().trim().length > 0){
      if(this.selectedCarnet.nature == 'OAT'){
        // Considerer sens contraire pour proposition
        if(this.selectedCarnet.operationSens == 'ACHAT'){
          this.prix = Number.parseInt(this.prixPropose.value) - this.margeOat;
        }else{
          this.prix = Number.parseInt(this.prixPropose.value) + this.margeOat;
        }
      }
    }
    //total
    if(Number(this.quantite.value) > 0){
      this.calculInteretOat();
      this.total = (this.prix * Number.parseInt(this.quantite.value)) + this.interet;
    }
  }

  onTauxProposeChange(event: any) {
    let rawValue = event.target.value.replace(" %", ''); 
    this.tauxPropose.setValue(rawValue, { emitEvent: false });

    if(!isNaN(Number(this.tauxPropose.value)) && this.tauxPropose.value.toString().trim().length > 0){
      if(this.selectedCarnet.nature == 'BAT'){
        // Considerer sens contraire pour proposition
        if(this.selectedCarnet.operationSens == 'ACHAT'){
          this.tauxTransaction = Number.parseFloat(this.tauxPropose.value) - this.margeBat;
        }else{
          this.tauxTransaction = Number.parseFloat(this.tauxPropose.value) + this.margeBat;
        }
        // calcul rendement
        if(this.selectedCarnet.echeanceDate != null && this.selectedCarnet.date != null){
          const dateOffre = new Date(this.selectedCarnet.date);
          const echeance = new Date(this.selectedCarnet.echeanceDate);

          const diffInDays = this.dateDiffInDays(dateOffre, echeance) + 1;
          const denominator = 1 - ((this.tauxTransaction/100) * diffInDays / 360);
          const result = 100*((this.tauxTransaction/100) / denominator);
          
          this.rendementEstime = Number.parseFloat(result.toFixed(4));
          
          if(Number(this.quantite.value) > 0){
            this.calculInteretEtTotalBat();
          }
        }
      }
    }

  }

  onTauxProposeBlur(event: any){
    let rawValue = event.target.value.replace(",", ".");
    this.tauxPropose.setValue(rawValue, { emitEvent: false }); 
    this.isTauxProposeFocused = false
  }


  addProposition(){
    if(this.formProposition.invalid){
     this.formProposition.markAllAsTouched();
     return; 
    }

    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();
    var data = {
      assetId: this.selectedCarnet.id,
      price: this.prix,
      amount: Number.parseFloat(this.quantite.getRawValue()),
      transactionValue: this.total,
      interet: this.interet
    }

    this.propositionService.addProposaltoAsset(data).subscribe((res) => {
      closeSpinner?.click();
      if (res.statusCode==200) {
        this.snackBar.open("Proposition envoyée avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.formProposition.reset();
        document.getElementById('closeProposition')?.click();
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
      console.log(error);
    });

  }

  calculInteretEtTotalBat(){
    if(this.selectedCarnet.echeanceDate != null && this.selectedCarnet.date != null){
      //total 
      const echeance = new Date(this.selectedCarnet.echeanceDate);
      const today = new Date();
      today.setHours(0, 0,0,0);
      const nbreJours = this.dateDiffInDays(today, echeance) + 1;

      const valeur = ( this.totalNominalValue * (100/(1 + (this.rendementEstime/100) * nbreJours/360))  ) / 100
      this.total = Math.floor(valeur);

      this.interet = this.totalNominalValue - this.total;
    }
  }

  calculInteretOat(){
    //Si couponRate et echeance existe
    if(this.selectedCarnet.couponRate != null && this.selectedCarnet.echeanceDate != null && this.selectedCarnet.echeanceDate.trim().length >= 8){
      const today = new Date();
      const maturity = new Date(this.selectedCarnet.echeanceDate);

      // Assumer un seul coupon par an : fréquence = 1
      const couponDay = maturity.getDate();
      const couponMonth = maturity.getMonth(); // 0-based (0 = janvier)

      // Dernier coupon
      let lastCoupon = new Date(today.getFullYear(), couponMonth, couponDay);
      if (lastCoupon > today) {
        lastCoupon.setFullYear(today.getFullYear() - 1);
      }

      // Prochain coupon
      let nextCoupon = new Date(lastCoupon);
      nextCoupon.setFullYear(lastCoupon.getFullYear() + 1);

      const daysSinceLastCoupon = this.dateDiffInDays(lastCoupon, today);
      const totalDaysBetweenCoupons = this.dateDiffInDays(lastCoupon, nextCoupon);

      const couponAmount = this.totalNominalValue * (this.selectedCarnet.couponRate/100);
      const interest = (couponAmount * daysSinceLastCoupon) / totalDaysBetweenCoupons;

      this.interet = Math.floor(interest);
    }else{
      this.interet = 0;
    }
  }


  private dateDiffInDays(startDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - startDate.getTime();
    return (diffTime / (1000 * 60 * 60 * 24));
  }

}
