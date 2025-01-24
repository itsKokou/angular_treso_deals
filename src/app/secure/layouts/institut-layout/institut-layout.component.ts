import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { UserDto } from '../../../core/models/user/user-dto';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-institut-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './institut-layout.component.html',
  styleUrl: './institut-layout.component.css'
})
export class InstitutLayoutComponent implements OnInit {
  private securityService = inject(SecurityServiceImpl);
  connectedUser? : UserDto;
  page : String = "Dashboard";

  constructor(private router: Router){

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Réinitialisez les données ici
        console.log(event.url);
        const url = event.url.split('/')[2]
        console.log(url);
        if(url=="dashboard"){
          this.page = "Dashboard";
        }else if(url=="profils"){
          this.page = "Profils";
        }else if(url=="utilisateurs"){
          this.page = "Utilisateurs";
        }
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.connectedUser = this.securityService.getConnectedUser();
  }

  redirectToProfil(){
    document.getElementById("dropdownDividerButton")?.click();
    localStorage.setItem("trader","Mon Profil");
    this.router.navigateByUrl('/trader/profil');
  }

  deconnexion(){
    localStorage.clear();
    this.securityService.isAuthenticated = false;
    this.router.navigateByUrl('/login');
  }

  hideSideBar(){
    document.getElementById("largeSidebar")?.classList.add("hidden");
    document.getElementById("smallSidebar")?.classList.remove("hidden");
    document.getElementById("main")?.classList.remove("xl:ml-68.5");
    document.getElementById("main")?.classList.add("xl:ml-8");
  }

  showSideBar(){
    document.getElementById("smallSidebar")?.classList.add("hidden");
    document.getElementById("largeSidebar")?.classList.remove("hidden");
    document.getElementById("main")?.classList.remove("xl:ml-8");
    document.getElementById("main")?.classList.add("xl:ml-68.5");
  }
}
