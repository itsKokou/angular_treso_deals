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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstitutionEnum } from '../../../../core/models/enum/institution-enum';
import { ProfilUser } from '../../../../core/models/enum/profil-user';

@Component({
    selector: 'app-utilisateurs',
    imports: [CommonModule, MatProgressBar, MatPaginatorModule, MatProgressSpinnerModule],
    templateUrl: './utilisateurs.component.html',
    styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements AfterViewInit {
  horizontalPosition : MatSnackBarHorizontalPosition = "center";
  verticalPosition : MatSnackBarVerticalPosition = "top";
  
  totalElements: number = 0;  
  isLoading: boolean = false;
  allDatas: UserDto[] = []; 
  datasPaginated: UserDto[] = []; 
  allDatasFiltered: UserDto[] = [];
  selectedProfil: String = "TOUT";
  selectedEtat: String = "TOUT";
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  selectedUser: UserDto = {};
  selectedAction: String = "";
  
  

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private userService: UserServiceImpl,
    private snackBar:  MatSnackBar
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
    this.userService.getAllUser().subscribe((res: RestResponse<UserDto[]>)=>{
      this.isLoading = false;
      console.log(res);
      
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

  showModaltraiterUser(item:UserDto, action:String){
    this.selectedUser = item;
    this.selectedAction = action;
    document.getElementById("btnConfirmUser")?.click();
  }

  traiterUser(){
    const openSpinner = document.getElementById("openSpinner");
    openSpinner?.click();
    if (this.selectedAction=="active") {
      this.activateUser();
    } else if(this.selectedAction=="lock") {
      this.lockUser();
    }else if(this.selectedAction=="delete") {
      this.deleteUser();
    }
  }

  activateUser(){
    const closeSpinner = document.getElementById("closeSpinner");
    this.userService.activateUserInstitut(this.selectedUser.id,this.selectedUser).subscribe( (res)=>{
      closeSpinner?.click();
      if (res.statusCode==204) {
        this.snackBar.open("Utilisateur Activé avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit();
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
    });
  }

  lockUser(){
    const closeSpinner = document.getElementById("closeSpinner");
    this.userService.LockUserInstitut(this.selectedUser.id,this.connectedUser.institutionId,this.selectedUser).subscribe( (res)=>{
      closeSpinner?.click();
      if (res.statusCode==200) {
        this.snackBar.open("Utilisateur Bloqué avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit();
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
    });
  }

  deleteUser(){
    const closeSpinner = document.getElementById("closeSpinner");
    this.userService.DeleteUserInstitut(this.selectedUser.id,this.connectedUser.institutionId).subscribe( (res)=>{
      closeSpinner?.click();
      if (res.statusCode==200) {
        this.snackBar.open("Utilisateur archivé avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit();
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
    });
  }

  filter() {
    if (this.selectedProfil == "TOUT"){
      if(this.selectedEtat == "TOUT"){
        this.allDatasFiltered = this.allDatas;
      }else{
        this.allDatasFiltered = this.allDatas.filter(item => item.status == this.selectedEtat);
      }
    }else{
      if(this.selectedEtat == "TOUT"){
        this.allDatasFiltered = this.allDatas.filter(item => item.profile == this.selectedProfil);
      }else{
        this.allDatasFiltered = this.allDatas.filter(item => item.status == this.selectedEtat && item.profile == this.selectedProfil);
      }
    }
    this.totalElements = this.allDatasFiltered.length;
    this.datasPaginated = this.allDatasFiltered.slice(0*20, (0 + 1)*20)
  }

  filterByEtat(etat: string) {
    this.selectedEtat = etat;
    this.filter();
  }

  filterByProfil(profil: string) {
    this.selectedProfil = profil;
    this.filter();
  }

  getProfilName(profil: any){
    let profils : { [key: string] : string} = {
      "APPLICAN": "Demandeur",
      "TRADER": "Trader",
      "VALIDATOR": "Validateur",
      "OPERATOR": "Opérateur",
      "INSTITUTE_ADMIN": "Admin Institution",
      "ADMIN_GESTION": "Admin Gestion",
      "SUPER_ADMIN": "Super Admin"
    }
    return (profils[profil] || profil);
  }

}
