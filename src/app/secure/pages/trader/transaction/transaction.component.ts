import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { initFlowbite } from 'flowbite';
import { AssetResponse } from '../../../../core/models/carnet-ordre/asset-response';
import { ProposalResponse } from '../../../../core/models/carnet-ordre/proposal-response';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { TransactionServiceImpl } from '../../../../core/services/impl/transaction.service.impl';
import { PropositionServiceImpl } from '../../../../core/services/impl/proposition.service.impl';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RestResponse } from '../../../../core/models/rest-response';
import { FormatNumberPipe } from '../../../../core/pipes/format-number.pipe';
import { CountryServiceImpl } from '../../../../core/services/impl/country.service.impl';
import { CountryDto } from '../../../../core/models/country/country-dto';

@Component({
  standalone: true,
  selector: 'app-transaction',
  imports: [CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, FormatNumberPipe ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements AfterViewInit {
  totalElements: number = 0; 
  selectedCarnet: AssetResponse = {}; 
  selectedNature: String = "TOUT";
  selectedSens: String = "TOUT";
  isLoading: boolean = false;
  isProposalLoading: boolean = false;
  allDatas: AssetResponse[] = []; 
  allDatasFiltered: AssetResponse[] = []; 
  allProposals: ProposalResponse[] = []; 
  datasPaginated: AssetResponse[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  private fb = inject(FormBuilder);
  countries: CountryDto[] = [];

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private countryService : CountryServiceImpl,
    private propositionService: PropositionServiceImpl
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

  rechercherOffres() {
    console.log(this.form.value);
    const {... data} = this.form.value
    this.allDatasFiltered = this.allDatas.filter(item => item.codeIsin?.includes(data.code!) && item.issuerCountry?.includes(data.emetteur!) 
    && item.nature?.includes(data.nature!) && item.echeanceDate?.includes(data.date!));

    if (data.num_transaction != null  && data.num_transaction != ""){
      var num = Number.parseInt(data.num_transaction);
      this.allDatasFiltered = this.allDatasFiltered.filter(item => item.id ==num);
    }

    if (data.taux != null  && data.taux != ""){
      var taux = Number.parseFloat(data.taux);
      // this.allDatasFiltered = this.allDatasFiltered.filter(item => item.transactionRate ==taux);
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
    this.transactionService.getHistoriqueTransaction().subscribe((res: RestResponse<AssetResponse[]>)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
        this.allDatasFiltered = this.allDatas;
        this.datasPaginated = this.allDatasFiltered.slice(0*5, (0 + 1)*5)
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
    console.log('Page change event:', event);
    this.datasPaginated = this.allDatasFiltered.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  voirDetail(btnDetail: HTMLButtonElement,carnet: AssetResponse) {
    //charger les données de item sur le modal
    this.selectedCarnet = carnet;
    this.isProposalLoading = true;
    this.allProposals = []; 
    this.propositionService.getAllProposalsByAssetId(carnet.id!).subscribe((res)=>{
      this.allProposals = res.data!;
      this.isProposalLoading = false;
    });
    btnDetail.click();
  }

  faireProposition(btnProposition: HTMLButtonElement,carnet: AssetResponse) {
    this.selectedCarnet = carnet;
    btnProposition.click();
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

