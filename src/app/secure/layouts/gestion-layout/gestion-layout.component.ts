import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-gestion-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './gestion-layout.component.html',
    styleUrl: './gestion-layout.component.css'
})
export class GestionLayoutComponent {

  ngOnInit(): void {
    initFlowbite();
  }
}
