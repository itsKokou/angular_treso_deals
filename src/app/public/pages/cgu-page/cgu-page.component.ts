import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CguServiceImpl } from '../../../core/services/impl/cgu.service.impl';
import { Router } from '@angular/router';
import { RestResponse } from '../../../core/models/rest-response';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { UserDto } from '../../../core/models/user/user-dto';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { error } from 'jquery';

@Component({
  selector: 'app-cgu-page',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './cgu-page.component.html',
  styleUrl: './cgu-page.component.css'
})
export class CguPageComponent implements OnInit{
  cgu: string = "";
  code: string = "";
  @ViewChild('myCheckbox') checkbox!: ElementRef<HTMLInputElement>;
  isChecked: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser();
  

  constructor(
    private cguService: CguServiceImpl,
    private router: Router,
    private snackBar: MatSnackBar
  ){
    
  }
  

  ngOnInit(): void {
    initFlowbite();
    document.getElementById("openSpinner")?.click();
    this.cguService.getCgu().subscribe((res: RestResponse<any>)=>{
      document.getElementById("closeSpinner")?.click();
      if(res.statusCode == 200){
        this.cgu = res.data!.content;
        this.code= res.data!.code;
      }
    });
  }

  onCheckboxChange(){
    if(this.checkbox.nativeElement.checked){
      this.isChecked = true;
    }else{
      this.isChecked = false;
    }
  }

  onContinuer(){
    document.getElementById("openSpinner")?.click();
    this.cguService.traiterCgu(this.code, "AGREE").subscribe((res: RestResponse<any>)=>{
      document.getElementById("closeSpinner")?.click();
      console.log(res);
      
      if(res.statusCode == 200){
        const profil = this.connectedUser.profile;
        if (profil=="ADMIN_GESTION"){
          this.router.navigateByUrl('/gestion/dashboard')
        }else if (profil=="TRADER"){
          localStorage.setItem("trader","Dashboard");
          this.router.navigateByUrl('/trader/dashboard')
        }else if (profil=="INSTITUTE_ADMIN"){
          this.router.navigateByUrl('/institut/dashboard')
        }else if (profil=="SUPER_ADMIN"){
          this.router.navigateByUrl('/admin/dashboard')
        }else{
          this.snackBar.open("Bonjour! Votre interface est en cours de développement... A bientôt","Ok",{
            duration: 6000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }else{
        this.snackBar.open("Une erreur système s'est produite. Veuillez rééssayer !","Ok",{
          duration: 6000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }, (error)=>{
      console.log(error);
      
      document.getElementById("closeSpinner")?.click();
      this.snackBar.open("Une erreur requête s'est produite. Veuillez rééssayer !","Ok",{
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    });
  }


}
