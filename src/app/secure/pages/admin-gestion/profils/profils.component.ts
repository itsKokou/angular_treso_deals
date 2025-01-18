import { AfterViewInit, Component } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ProfilResponse } from '../../../../core/models/profil/profil-response';
import { ProfilServiceImpl } from '../../../../core/services/impl/profil.service.impl';
import { RestResponse } from '../../../../core/models/rest-response';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProposalEnum } from '../../../../core/models/enum/proposal-enum';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
    selector: 'app-profils',
    imports: [RouterLink, CommonModule, MatProgressBarModule, MatPaginatorModule, MatProgressSpinnerModule],
    templateUrl: './profils.component.html',
    styleUrl: './profils.component.css'
})
export class ProfilsComponent implements AfterViewInit {
  totalElementsInstitut: number = 0;  
  totalElementsIntermediaire: number = 0;  
  proposalMessage: string = "l\'acceptation"
  selectedProfil: ProfilResponse = {}
  selectedStatut: ProposalEnum.StatusEnum = "PENDING"; 

  isLoading: boolean = false;
  allDatasInstitut: ProfilResponse[] = []; 
  allDatasIntermediaire: ProfilResponse[] = []; 
  datasPaginatedInstitut: ProfilResponse[] = []; 
  datasPaginatedIntermediaire: ProfilResponse[] = []; 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private profilService: ProfilServiceImpl,
    private snackBar: MatSnackBar
  ){
    localStorage.setItem("gestion","Profils");
  }


  ngAfterViewInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Profils par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";
  }

  reloadData(){
    this.isLoading = true;
    this.profilService.getAllProfil().subscribe((res: any)=>{
      this.isLoading = false;
      if (res.statusCode == 200) {
        const datas : ProfilResponse[] = res.data?.content;
        this.allDatasInstitut = datas.filter((value) => value.type === 'BANK');
        this.allDatasIntermediaire = datas.filter((value) => value.type === 'SGI');
        this.datasPaginatedInstitut = this.allDatasInstitut.slice(0*5, (0 + 1)*5)
        this.datasPaginatedIntermediaire = this.allDatasIntermediaire.slice(0*5, (0 + 1)*5)
        this.totalElementsInstitut = this.allDatasInstitut.length;
        this.totalElementsIntermediaire = this.allDatasIntermediaire.length;

      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.reloadData();
  }

  
  onPageChangeInstitut(event: PageEvent) {
    this.datasPaginatedInstitut = this.allDatasInstitut.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  onPageChangeIntermediaire(event: PageEvent) {
    this.datasPaginatedIntermediaire = this.allDatasIntermediaire.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  openTreatmentModal(profil: ProfilResponse, statut: ProposalEnum.StatusEnum, message: string){
    this.selectedProfil = profil;
    this.selectedStatut = statut;
    this.proposalMessage = message;
    document.getElementById("btnConfirm")?.click();
  }

  treatProfil(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();

    const msg = this.selectedStatut == "ACCEPTED" ? "Profil accepté avec succès" : "Profil rejeté avec succès" 
    this.profilService.updateProfil(this.selectedProfil.id!, this.selectedStatut).subscribe((res : any) => {
        closeSpinner?.click();
        if (res.statusCode==200) {
          this.snackBar.open("Profil accepté avec succès","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.reloadData();
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

}
