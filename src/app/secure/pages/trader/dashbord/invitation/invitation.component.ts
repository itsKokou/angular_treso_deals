import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { InvitationServiceImpl } from '../../../../../core/services/impl/invitation.service.impl';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DashbordComponent } from '../dashbord.component';

@Component({
  selector: 'app-invitation',
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, AngularEditorModule, MatDialogModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  messageContent : string = "";
  isLoading : boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height:'15rem',
    minHeight:'5rem',
    placeholder: 'Message...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Times New Roman',
    enableToolbar: false,
    showToolbar: false,
  };
  
  constructor(
    private snackBar: MatSnackBar,
    private invitationService : InvitationServiceImpl,
    private fb: FormBuilder,
    public dialogRef:MatDialogRef<DashbordComponent>,
  ){
    this.messageContent = 
    `<div style="color: black; font-family: 'times new roman';">`+
      `<p>Bonjour,</p>`+
      `<p>Nous sommes ravis de vous inviter à rejoindre notre plateforme <strong>TRESO LINK</strong> en tant qu’<strong>Institution Trader</strong>.</p>`+
      `<br>`+
      `<p>Ce statut vous permettra de voir et partager <strong>en temps réel</strong>, des <strong>opportunités d’investissement sur titres</strong>, au sein d’un réseau dédié aux professionnels des marchés.</p>`+
      `<br>`+
      `<p><a href='#' style="margin-right: 20px;"><span style="font-weight:700; font-size: 16px;">Rejoindre maintenant</span></a> | <a href='#' style="margin-left: 20px;"><span style="font-weight:700; font-size: 16px;">Présentation de TRESO LINK</span></a></p>`+
      `<br>`+
      `<p>A très bientôt !</p>`+
      `<br>`+
      `<p>Equipe support _ TRESO LINK</p>`+
      `<p>Téléphone : </p>`+
      `<p>Adresse mail : </p>`+
      `<br>`+
      `<p>© 2025 Treso link. Tous droits réservés.</p>`+
    `</div>`;
  }

  form = this.fb.group({
    name : ["", [Validators.required, Validators.minLength(2)]],
    email : ["", [Validators.required, Validators.email]],
    message : ["", [Validators.required]],
    institutionType : ["BANK"]
  });

  get name(){
    return this.form.controls["name"] as FormControl;
  }
  get email(){
    return this.form.controls["email"] as FormControl;
  }

  get message(){
    return this.form.controls["message"] as FormControl;
  }

  onSubmitInvitation(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }else{
      this.isLoading = true;
      const {... data} = this.form.getRawValue();
      console.log(data);
      
      this.invitationService.sendInvitation(data).subscribe((res : any) => {
        this.isLoading = false;

        this.dialogRef.close(res);
      }, (error)=>{
        this.isLoading = false;
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
