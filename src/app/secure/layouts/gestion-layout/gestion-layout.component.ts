import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserDto } from '../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gestion-layout',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './gestion-layout.component.html',
    styleUrl: './gestion-layout.component.css'
})
export class GestionLayoutComponent implements OnInit {
  private securityService = inject(SecurityServiceImpl);
  connectedUser? : UserDto;
  page : any = "Dashboard";

  constructor(private router: Router){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('/')[2]
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
