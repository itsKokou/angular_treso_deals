import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AssetResponse } from '../../../../core/models/carnet-ordre/asset-response';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CarnetOrdreServiceImpl } from '../../../../core/services/impl/carnet-ordre.service.impl';
import { ResponseAssetResponse } from '../../../../core/models/carnet-ordre/response-asset-response';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-carnet-ordre',
  standalone: true,
  imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule],
  templateUrl: './carnet-ordre.component.html',
  styleUrl: './carnet-ordre.component.css'
})
export class CarnetOrdreComponent implements AfterViewInit {
  totalElements: number = 0; 
  selectedCarnet: AssetResponse|null = null; 

  isLoading: boolean = false;
  allDatas: AssetResponse[] = []; 
  datasPaginated: AssetResponse[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private carnetOrdreService: CarnetOrdreServiceImpl,
  ){}


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
    this.carnetOrdreService.getAllCarnetOrdre().subscribe((res: ResponseAssetResponse)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
        this.datasPaginated = this.allDatas.slice(0*5, (0 + 1)*5)
        this.totalElements = this.allDatas.length;
      }
    });
  }

  
  onPageChange(event: PageEvent) {
    console.log('Page change event:', event);
    this.datasPaginated = this.allDatas.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  voirDetail(btnDetail: HTMLButtonElement,carnet: AssetResponse) {
    //charger les données de item sur le modal
    this.selectedCarnet = carnet;
    btnDetail.click();
  }
  supprimerCarnet(btnSupprimer: HTMLButtonElement,carnet: AssetResponse) {
    this.selectedCarnet = carnet;
    btnSupprimer.click();
  }

}
