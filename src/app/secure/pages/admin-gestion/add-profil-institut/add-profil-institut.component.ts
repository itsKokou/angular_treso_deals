import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-add-profil-institut',
  standalone: true,
  imports: [],
  templateUrl: './add-profil-institut.component.html',
  styleUrl: './add-profil-institut.component.css'
})
export class AddProfilInstitutComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
