import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-dashbord',
    imports: [],
    templateUrl: './dashbord.component.html',
    styleUrl: './dashbord.component.css'
})
export class DashbordComponent {
  constructor(){
  }
  ngOnInit(): void {
    initFlowbite();
  }
}
