import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserDto } from '../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';

@Component({
    selector: 'app-gestion-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './gestion-layout.component.html',
    styleUrl: './gestion-layout.component.css'
})
export class GestionLayoutComponent implements OnInit {
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
        this.page = localStorage.getItem("gestion");
      }
    });
  }

  deconnexion(){
    localStorage.clear();
    this.securityService.isAuthenticated = false;
    this.router.navigateByUrl('/login');
  }

  onClick(){
    const toggleButton = document.querySelector('[data-drawer-toggle="default-sidebar"]')!;
    const sidebar = document.getElementById('default-sidebar')!;

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
  }
}
