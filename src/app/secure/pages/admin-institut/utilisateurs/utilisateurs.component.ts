import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { InstituteUserDTO } from '../../../../core/models/institution/institute-user-dto';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { UserServiceImpl } from '../../../../core/services/impl/user.service.impl';
import { initFlowbite } from 'flowbite';
import { RestResponse } from '../../../../core/models/rest-response';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, ReactiveFormsModule, MatProgressBar, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements AfterViewInit {
  totalElements: number = 0;  
  isLoading: boolean = false;
  allDatas: InstituteUserDTO[] = []; 
  datasPaginated: InstituteUserDTO[] = [];
  selectedUser: InstituteUserDTO = {};
  selectedAction: String = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  private fb = inject(FormBuilder); 

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private userService: UserServiceImpl,
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
    this.matPaginatorIntl.itemsPerPageLabel="Utilisateurs par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";
  }

  ngOnInit(): void {
    initFlowbite();
    this.isLoading = true;
    this.userService.getUserByInstitutionId(this.connectedUser.institutionId!).subscribe((res: RestResponse<InstituteUserDTO[]>)=>{
    //this.userService.getUserAdminInstitut().subscribe((res: RestResponse<any>)=>{
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
    data.institutionId = this.connectedUser.institutionId!;
    this.userService.addUser(data).subscribe( (res)=>{
      closeSpinner?.click();
      if (res.statusCode==204) {
        this.snackBar.open("Utilisateur ajouté avec succès","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.formProfil.reset();
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

  voirDetail(item:InstituteUserDTO){
    this.selectedUser = item;
    document.getElementById("user-institut-btn")?.click();
  }

  showModaltraiterUser(item:InstituteUserDTO, action:String){
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

}
