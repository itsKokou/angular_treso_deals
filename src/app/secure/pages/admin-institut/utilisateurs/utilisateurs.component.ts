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
import { MatTooltipModule } from '@angular/material/tooltip';
import { InstitutServiceImpl } from '../../../../core/services/impl/institut.service.impl';
import { CountryServiceImpl } from '../../../../core/services/impl/country.service.impl';
import { CountryDto } from '../../../../core/models/country/country-dto';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, ReactiveFormsModule, MatProgressBar, MatPaginatorModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements AfterViewInit {
  totalElements: number = 0;  
  isLoading: boolean = false;
  allDatas: InstituteUserDTO[] = []; 
  datasPaginated: InstituteUserDTO[] = [];
  allDatasFiltered: InstituteUserDTO[] = [];
  selectedUser: InstituteUserDTO = {};
  selectedAction: String = "";
  selectedProfil: String = "TOUT";
  selectedEtat: String = "TOUT";
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  private fb = inject(FormBuilder); 
  country? : CountryDto;
  flag = {
    code: "",
    flag: ""
  };
  flagTab = [
    {
      code : "229",
      flag : "https://flagcdn.com/w20/bj.png"
    },
    {
      code : "226",
      flag : "https://flagcdn.com/w20/bf.png"
    },
    {
      code : "225",
      flag : "https://flagcdn.com/w20/ci.png"
    },
    {
      code : "245",
      flag : "https://flagcdn.com/w20/gw.png"
    },
    {
      code : "223",
      flag : "https://flagcdn.com/w20/ml.png"
    },
    {
      code : "227",
      flag : "https://flagcdn.com/w20/ne.png"
    },
    {
      code : "221",
      flag : "https://flagcdn.com/w20/sn.png"
    },
    {
      code : "228",
      flag : "https://flagcdn.com/w20/tg.png"
    }
  ]


  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private userService: UserServiceImpl,
    private snackBar: MatSnackBar,
    private institutService: InstitutServiceImpl,
    private countryService: CountryServiceImpl
  ){
  }
  
  formProfil = this.fb.group({
    firstName: ["", [Validators.required, Validators.minLength(2)]],
    lastName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    secondEmail: ["", [Validators.email]],
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
  get secondEmail(){
    return this.formProfil.controls["secondEmail"] as FormControl;
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
      this.isLoading = false;
      if (res.statusCode == 200) {
        this.allDatas = res.data!.reverse();
        this.totalElements = this.allDatas.length;
        this.datasPaginated = this.allDatas.slice(0*20, (0 + 1)*20);
      }
    });     

    this.institutService.getInstitutionById(this.connectedUser.institutionId!).subscribe((res:RestResponse<any>)=>{
      if (res.statusCode == 200) {
        const pays = res.data.country || "";

        this.countryService.getCountries().subscribe((res : RestResponse<CountryDto[]>)=>{
          if(res.statusCode==200){
            this.country = res.data?.find((value)=>value.name == pays)
            this.flag = this.flagTab.find((value)=> value.code == this.country!.areaCode!.toString())!;
            
          }
        }); 
      }
    })
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
    data.phoneNumber = "+"+this.flag.code+ " "+data.phoneNumber;
    data.fixeNumber = "+"+this.flag.code+ " "+data.fixeNumber;
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
        console.log(res);
        this.snackBar.open("Oupsss! Le/Les e-mail(s) saisi(s) existe(nt) déjà dans le système","Ok",{
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }, (error)=>{
      console.log(error);
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
    }if(this.selectedAction=="reinit-password") {
      this.reinitUserPassword();
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
    this.userService.lockUserInstitut(this.selectedUser.id,this.connectedUser.institutionId,this.selectedUser).subscribe( (res)=>{
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
    this.userService.deleteUserInstitut(this.selectedUser.id,this.connectedUser.institutionId).subscribe( (res)=>{
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

  reinitUserPassword(){
    const closeSpinner = document.getElementById("closeSpinner");
    this.userService.reinitUserPassword(this.selectedUser.id, this.selectedUser).subscribe( (res)=>{
      closeSpinner?.click();
      console.log(res);
      
      if (res.statusCode==204) {
        this.snackBar.open("Mot de passe rénitialisé avec succès ! Le nouveau mot de passe a été envoyé à l'utilisateur par mail","Ok",{
          duration: 6000,
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
      console.log(error);
      
      this.snackBar.open("Une erreur s'est produite. Veuillez rééssayer plus tard !","Ok",{
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

}
