import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-admin-layout',
    imports: [],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
