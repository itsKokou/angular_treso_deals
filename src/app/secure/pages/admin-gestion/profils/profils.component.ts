import { AfterViewInit, Component, inject } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { initFlowbite } from 'flowbite';
import { ProfilResponse } from '../../../../core/models/profil/profil-response';
import { ProfilServiceImpl } from '../../../../core/services/impl/profil.service.impl';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProposalEnum } from '../../../../core/models/enum/proposal-enum';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { InvitationServiceImpl } from '../../../../core/services/impl/invitation.service.impl';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { InvitationComponent } from './invitation/invitation.component';

@Component({
    selector: 'app-profils',
    imports: [ReactiveFormsModule, CommonModule, MatProgressBarModule, MatPaginatorModule, MatProgressSpinnerModule, MatDialogModule],
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
  datasPaginatedIntermediaire: ProfilResponse[] = []; ;
  allDatasInstitutFiltered: ProfilResponse[] = [];
  allDatasIntermediaireFiltered: ProfilResponse[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  selectedEtat: String = "TOUT";
  
  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private profilService: ProfilServiceImpl,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ){
  }


  ngAfterViewInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Adhésions par page";
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
        const datas : ProfilResponse[] = res.data.reverse();
        this.allDatasInstitut = datas.filter((value) => value.type === 'BANK');
        this.allDatasIntermediaire = datas.filter((value) => value.type === 'SGI');
        this.datasPaginatedInstitut = this.allDatasInstitut.slice(0*20, (0 + 1)*20)
        this.datasPaginatedIntermediaire = this.allDatasIntermediaire.slice(0*20, (0 + 1)*20)
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
          this.snackBar.open(msg,"Ok",{
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



  filterByEtat(etat: string) {
    this.selectedEtat = etat;
    if(this.selectedEtat == "TOUT"){
        this.allDatasInstitutFiltered = this.allDatasInstitut.filter((value) => value.type === 'BANK');
        this.allDatasIntermediaireFiltered = this.allDatasIntermediaire.filter((value) => value.type === 'SGI');
      }else{
        this.allDatasInstitutFiltered = this.allDatasInstitut.filter((value) => value.type === 'BANK' && value.status == etat);
        this.allDatasIntermediaireFiltered = this.allDatasIntermediaire.filter((value) => value.type === 'SGI' && value.status == etat);
      }
      this.totalElementsInstitut = this.allDatasInstitutFiltered.length;
      this.totalElementsIntermediaire = this.allDatasIntermediaireFiltered.length;
      this.datasPaginatedInstitut = this.allDatasInstitutFiltered.slice(0*20, (0 + 1)*20)
      this.datasPaginatedIntermediaire = this.allDatasIntermediaireFiltered.slice(0*20, (0 + 1)*20)
  }

  openDialogInvitation(){
    const dialogRef = this.dialog.open(InvitationComponent,{width:'70%', disableClose: true});
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        console.log("Type", result);

        if (result.statusCode==204) {
          this.snackBar.open("Votre invitation a été envoyée avec succès! \nNous vous remercions pour votre marque de confiance","Ok",{
            duration: 8000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.snackBar.open("Une erreur s'est produite lors de l'envoi. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    })
  }

}
