import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserServiceImpl } from '../../../../core/services/impl/user.service.impl';
import { InstituteUserDTO } from '../../../../core/models/institution/institute-user-dto';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { RestResponse } from '../../../../core/models/rest-response';
import { UserStandard } from '../../../../core/models/user/user-standard';

@Component({
    selector: 'app-utilisateurs',
    imports: [CommonModule, MatProgressBar, MatPaginatorModule],
    templateUrl: './utilisateurs.component.html',
    styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements AfterViewInit {
  totalElements: number = 0;  

  isLoading: boolean = false;
  allDatas: UserStandard[] = []; 
  datasPaginated: UserStandard[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private userService: UserServiceImpl,
  ){
    localStorage.setItem("gestion","Utilisateurs");
  }


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
    this.userService.getAllUser().subscribe((res: RestResponse<UserStandard[]>)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!.reverse();
        this.totalElements = this.allDatas.length;
        this.datasPaginated = this.allDatas.slice(0*20, (0 + 1)*20);
      }
    });
  }

  
  onPageChange(event: PageEvent) {
    this.datasPaginated = this.allDatas.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

}
