import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserServiceImpl } from '../../../../core/services/impl/user.service.impl';
import { InstituteUserDTO } from '../../../../core/models/institution/institute-user-dto';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { ResponseInstituteUserDTO } from '../../../../core/models/institution/response-institute-user-dto';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
    selector: 'app-utilisateurs',
    imports: [RouterLink, CommonModule, MatProgressBar, MatPaginatorModule],
    templateUrl: './utilisateurs.component.html',
    styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements AfterViewInit {
  totalElements: number = 0;  

  isLoading: boolean = false;
  allDatas: InstituteUserDTO[] = []; 
  datasPaginated: InstituteUserDTO[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private userService: UserServiceImpl,
  ){}


  ngAfterViewInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Utilisateurs par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";
  }

  ngOnInit(): void {
    initFlowbite();
    this.isLoading = true;
    // this.userService.getUserByInstitutionId(this.connectedUser.institutionId!).subscribe((res: ResponseInstituteUserDTO)=>{
    this.userService.getUserByInstitutionId(1001).subscribe((res: ResponseInstituteUserDTO)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!;
        this.totalElements = this.allDatas.length;
      }
    });
  }

  
  onPageChange(event: PageEvent) {
    console.log('Page change event:', event);
    this.datasPaginated = this.allDatas.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

}
