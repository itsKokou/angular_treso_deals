import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-carnet-ordre',
  standalone: true,
  imports: [RouterLink,],
  templateUrl: './carnet-ordre.component.html',
  styleUrl: './carnet-ordre.component.css'
})
export class CarnetOrdreComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
