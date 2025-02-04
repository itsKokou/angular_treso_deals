import { AfterViewInit, Component, inject } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { InvitationServiceImpl } from '../../../../core/services/impl/invitation.service.impl';

@Component({
    selector: 'app-profils',
    imports: [ReactiveFormsModule, CommonModule, MatProgressBarModule, MatPaginatorModule, MatProgressSpinnerModule],
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
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private profilService: ProfilServiceImpl,
    private snackBar: MatSnackBar,
    private invitationService : InvitationServiceImpl,
    private fb: FormBuilder
  ){
    this.institutionType.valueChanges.subscribe((value)=>{
      if (value == "BANK") {
        this.message.setValue("Bonjour,\nNous avons l'honneur de vous inviter à rejoindre la plateforme TRESO LINK, en qualité d'Intermédiaire Financier.\nNous vous remercions d'avance pour votre marque de confiance.\nTeam TRESO LINK");
      } else if(value == "SGI") {
         this.message.setValue("Bonjour,\n"+ this.connectedUser.firstName + " " + this.connectedUser.lastName + " vous invite à rejoindre la plateforme TRESO LINK, afin de rapprocher vos opportunités d'investissement.");
      }
    });
  }

  form = this.fb.group({
    name : ["", [Validators.required, Validators.minLength(2)]],
    email : ["", [Validators.required, Validators.email]],
    institutionType : ["", [Validators.required]],
    message : [""]
  });

  get name(){
    return this.form.controls["name"] as FormControl;
  }
  get email(){
    return this.form.controls["email"] as FormControl;
  }
  get institutionType(){
    return this.form.controls["institutionType"] as FormControl;
  }
  get message(){
    return this.form.controls["message"] as FormControl;
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

  onSubmitInvitation(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      const openSpinner = document.getElementById("openSpinner");
      const closeSpinner = document.getElementById("closeSpinner");
      openSpinner?.click();
      const {... data} = this.form.getRawValue();
      
      this.invitationService.sendInvitation(data).subscribe((res : any) => {
        closeSpinner?.click();
        document.getElementById("closeInvitationModal")?.click();

        
        if (res.statusCode==204) {
          this.snackBar.open("Votre invitation a été envoyée avec succès! \nNous vous remercions pour votre marque de confiance","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.form.reset();
        } else {
          this.snackBar.open("Une erreur s'est produite lors de l'envoi. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }, (error)=>{
        closeSpinner?.click();
        this.snackBar.open("Une erreur s'est produite lors de l'envoi SMTP. Veuillez rééssayer !","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        console.log(error);
      });

    }
  }

}
