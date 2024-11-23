import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [RouterLink, ],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
