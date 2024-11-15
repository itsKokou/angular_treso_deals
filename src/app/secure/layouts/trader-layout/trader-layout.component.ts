import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-trader-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './trader-layout.component.html',
  styleUrl: './trader-layout.component.css'
})
export class TraderLayoutComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
