import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [RouterLink, ],
  templateUrl: './trading.component.html',
  styleUrl: './trading.component.css'
})
export class TradingComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
