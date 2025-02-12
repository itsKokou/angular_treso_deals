import { AfterViewInit, Component, inject } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-trading',
  imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, MatProgressSpinnerModule, FormatNumberPipe],
  templateUrl: './trading.component.html',
  styleUrl: './trading.component.css'
})
export class TradingComponent implements AfterViewInit{
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
  

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private propositionService: PropositionServiceImpl,
    private countryService : CountryServiceImpl,
    private fb: FormBuilder,
    private snackBar:MatSnackBar,
  ){
  }

  form = this.fb.group({
    num_transaction: "",
    date: "",
    emetteur: "",
    nature: "",
    code: "",
    taux: "",
  })

  get num_transaction(){
    return this.form.controls["num_transaction"] as FormControl;
  }
  get date(){
    return this.form.controls["date"] as FormControl;
  }
  get emetteur(){
    return this.form.controls["emetteur"] as FormControl;
  }
  get nature(){
    return this.form.controls["nature"] as FormControl;
  }
  get code(){
    return this.form.controls["code"] as FormControl;
  }
  get taux(){
    return this.form.controls["taux"] as FormControl;
  }

  //---------------- Form Proposition
  formProposition = this.fb.group({
    quantite: [0, [Validators.required, Validators.min(1), this.validateQte]],
    prixPropose: [0, [Validators.required, Validators.min(1), this.validateDigit]],
    prixTransaction: 0
  })

  get quantite(){
    return this.formProposition.controls["quantite"] as FormControl;
  }
  get prixPropose(){
    return this.formProposition.controls["prixPropose"] as FormControl;
  }
  get prixTransaction(){
    return this.formProposition.controls["prixTransaction"] as FormControl;
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
    console.log(this.form.value);
    const {... data} = this.form.value
    this.allDatasFiltered = this.allDatas.filter(item => item.codeIsin?.includes(data.code!) && item.issuerCountry?.includes(data.emetteur!) 
    && item.nature?.includes(data.nature!) && item.createdAt?.includes(data.date!));

    if (data.num_transaction != null  && data.num_transaction != ""){
      var num = Number.parseInt(data.num_transaction);
      this.allDatasFiltered = this.allDatasFiltered.filter(item => item.id ==num);
    }

    if (data.taux != null  && data.taux != ""){
      var taux = Number.parseFloat(data.taux);
      // this.allDatasFiltered = this.allDatasFiltered.filter(item => item.transactionRate ==taux);
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
    this.isLoading = true;
    this.transactionService.getTransactionEncours().subscribe((res: RestResponse<AssetResponse[]>)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
        this.allDatasFiltered = this.allDatas.reverse();
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
    this.quantite.addValidators(Validators.max(carnet.amount!))
    btnProposition.click();
  }

  abortProposition(){
    this.formProposition.reset();
  }

  onQuantiteChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.quantite.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage

    if(!isNaN(Number(this.quantite.value))){
      this.prixTransaction.setValue(this.quantite.value*this.prixPropose.value)
    }
  }

  onPrixChange(event: any) {
    let rawValue = event.target.value.replace(/\s/g, ''); // Supprime les espaces pour garder la vraie valeur
    this.prixPropose.setValue(rawValue, { emitEvent: false }); // Met à jour le FormControl sans modifier l'affichage

    if(!isNaN(Number(this.quantite.value))){
      this.prixTransaction.setValue(this.quantite.value*this.prixPropose.value)
    }
  }


  addProposition(){
    if(this.formProposition.invalid){
     this.formProposition.markAllAsTouched();
     return; 
    }

    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();
    let val = this.prixTransaction.getRawValue();
    var data = {
      assetId: this.selectedCarnet.id,
      price: Number.parseFloat(this.prixPropose.getRawValue()),
      amount: Number.parseFloat(this.quantite.getRawValue()),
      transactionValue: Number.parseFloat(val.toString().replace(/\s/g, '')),
      interet: 100000
    }

    this.propositionService.addProposaltoAsset(data).subscribe((res) => {
      closeSpinner?.click();
      if (res.statusCode==200) {
        this.snackBar.open("Proposition effectuée avec succès","Ok",{
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

}
