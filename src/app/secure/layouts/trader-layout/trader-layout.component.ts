import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { UserDto } from '../../../core/models/user/user-dto';

@Component({
    selector: 'app-trader-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './trader-layout.component.html',
    styleUrl: './trader-layout.component.css'
})
export class TraderLayoutComponent implements OnInit {
  private securityService = inject(SecurityServiceImpl);
  connectedUser? : UserDto;
  page : any = "Dashboard";

  constructor(private router: Router){
  }

  ngOnInit(): void {
    initFlowbite();
    this.connectedUser = this.securityService.getConnectedUser();
    this.page = localStorage.getItem("trader");

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Réinitialisez les données ici
        this.page = localStorage.getItem("trader");
      }
    });
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
}
