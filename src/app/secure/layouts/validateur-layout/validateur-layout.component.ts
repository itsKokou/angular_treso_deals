import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-validateur-layout',
  standalone: true,
  imports: [],
  templateUrl: './validateur-layout.component.html',
  styleUrl: './validateur-layout.component.css'
})
export class ValidateurLayoutComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
