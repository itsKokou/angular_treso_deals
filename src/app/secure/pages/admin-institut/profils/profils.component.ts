import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ProfilResponse } from '../../../../core/models/profil/profil-response';
import { ProposalEnum } from '../../../../core/models/enum/proposal-enum';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProfilServiceImpl } from '../../../../core/services/impl/profil.service.impl';
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profils',
  imports: [CommonModule, MatProgressBarModule, MatPaginatorModule, MatProgressSpinnerModule, ReactiveFormsModule],
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
  private fb = inject(FormBuilder);

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private profilService: ProfilServiceImpl,
    private snackBar: MatSnackBar
  ){
  }

  formProfil = this.fb.group({
    firstName: ["", [Validators.required, Validators.minLength(2)]],
    lastName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    secondEmail: ["", [Validators.required, Validators.email]],
    phoneNumber: ["", [Validators.required]],
    fixeNumber: ["", [Validators.required]],
    job: ["", [Validators.required, Validators.minLength(2)]],
    department: ["", [Validators.required, Validators.minLength(2)]],
    profile:["", [Validators.required]],
    institutionId : 0,
  })

  get firstName(){
    return this.formProfil.controls["firstName"] as FormControl;
  }
  get lastName(){
    return this.formProfil.controls["lastName"] as FormControl;
  }
  get email(){
    return this.formProfil.controls["email"] as FormControl;
  }
  get phoneNumber(){
    return this.formProfil.controls["phoneNumber"] as FormControl;
  }
  get fixeNumber(){
    return this.formProfil.controls["fixeNumber"] as FormControl;
  }
  get job(){
    return this.formProfil.controls["job"] as FormControl;
  }
  get department(){
    return this.formProfil.controls["department"] as FormControl;
  }
  get profile(){
    return this.formProfil.controls["profile"] as FormControl;
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

  resetFormProfil(){
    this.formProfil.reset();
  }

  onSubmit(){
    if (this.formProfil.invalid) {
      this.formProfil.markAllAsTouched();
    }else{
      document.getElementById("closeProfilModal")?.click();
      document.getElementById("btnConfirmProfil")?.click();
    }
  }

  confirmProfilSubmission(){
    const openSpinner = document.getElementById("openSpinner");
    const closeSpinner = document.getElementById("closeSpinner");
    openSpinner?.click();

    const {... data} = this.formProfil.getRawValue();
    this.profilService.addProfil(data).subscribe( (res)=>{
      closeSpinner?.click();
      if (res.statusCode==200) {
        this.snackBar.open("Profil ajouté avec succès","Ok",{
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.formProfil.reset();
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
