import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-add-carnet-ordre',
  standalone: true,
  imports: [],
  templateUrl: './add-carnet-ordre.component.html',
  styleUrl: './add-carnet-ordre.component.css'
})
export class AddCarnetOrdreComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
