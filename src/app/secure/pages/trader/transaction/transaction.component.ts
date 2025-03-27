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
import { PercentagePipe } from '../../../../core/pipes/percentage.pipe';

@Component({
  standalone: true,
  selector: 'app-transaction',
  imports: [CommonModule, MatProgressBar, MatPaginatorModule, ReactiveFormsModule, FormatNumberPipe, PercentagePipe ],
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
  isSearch: Boolean = false;

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private transactionService: TransactionServiceImpl,
    private countryService : CountryServiceImpl,
    private propositionService: PropositionServiceImpl
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
    this.isLoading = true;
    this.isSearch = false;
    this.transactionService.getHistoriqueTransaction().subscribe((res: RestResponse<AssetResponse[]>)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
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

}

