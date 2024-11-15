import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-profils',
  standalone: true,
  imports: [],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
