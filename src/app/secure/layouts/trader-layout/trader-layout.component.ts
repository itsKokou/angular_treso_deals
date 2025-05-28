import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  page : any ;

  constructor(
    private router: Router,
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Réinitialisez les données ici
        const url = event.url.split('/')[2]
        if(url=="dashboard"){
          this.page = "Dashboard";
        }else if(url=="transaction"){
          this.page = "Mes Transactions";
        }else if(url=="trading"){
          this.page = "Trading";
        }else if(url=="carnet"){
          this.page = "Carnet d'ordres";
        }else if(url=="chat"){
          this.page = "Messagerie";
        }else if(url=="proposition"){
          this.page = "Mes Propositions";
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
