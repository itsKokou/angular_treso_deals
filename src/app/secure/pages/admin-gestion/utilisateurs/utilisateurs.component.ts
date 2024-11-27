import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [RouterLink, ],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
